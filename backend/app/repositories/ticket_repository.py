import json
from datetime import datetime
from typing import Optional

from fastapi.encoders import jsonable_encoder
from pytz import utc

from app.Author import Author
from app.Filters import Filters, Date
from app.Message import Message
from app.Ticket import Ticket
from app.repositories.message_repository import MessageRepository

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
DATE_FORMAT_2 = "%Y-%m-%d %H:%M:%S.%f"


def username_filter(tickets: list[Ticket], usernames: list[str]) -> list[Ticket]:
    return [ticket for ticket in tickets if ticket.message.author.name in usernames]


def status_filter(tickets: list[Ticket], status: str) -> list[Ticket]:
    return [ticket for ticket in tickets if ticket.status == status]


def date_filter(tickets: list[Ticket], date: Date) -> list[Ticket]:
    new_tickets = []
    for ticket in tickets:
        ticket_date = ticket.timestamp
        start_date = date.start if date.start else utc.localize(ticket_date)
        end_date = date.end if date.end else utc.localize(ticket_date)
        if start_date <= utc.localize(ticket_date)  <= end_date:
            new_tickets.append(ticket)
    return new_tickets


def ticket_sorter(tickets: list[Ticket], field_name, reverse) -> list[Ticket]:
    match field_name:
        case "date":
            return sorted(tickets, key=lambda t: t.timestamp, reverse=reverse)
        case "username":
            return sorted(tickets, key=lambda t: t.message.author.name, reverse=reverse)
        case "status":
            return sorted(tickets, key=lambda t: t.status, reverse=reverse)
        case _:
            return tickets


def search_tickets(tickets: list[Ticket], text) -> list[Ticket]:
    return [ticket for ticket in tickets if text.lower() in ticket.message.content.lower()]


class TicketRepository:
    def __init__(self, tickets: dict, messages_repository: MessageRepository):
        self.tickets: list[Ticket] = []

        try:
            self.init_from_raw_data(tickets, messages_repository)
        except:
            self.init_from_structured_data(tickets, messages_repository)

        self.export_to_json()

    def export_to_csv(self):
        with open("data/tickets.csv", mode="w", encoding='utf-8') as new_file:
            structured_tickets_str = ""
            for ticket in self.tickets:
                structured_tickets_str += (ticket.to_csv_string() + "\n")
            new_file.write(structured_tickets_str)
        print("data_written")

    def export_to_json(self):
        with open("data/tickets.json", mode="w") as json_file:
            json.dump(jsonable_encoder(self.tickets), json_file)
            print("json data exported")

    def get_tickets(self, start: Optional[int] = 0, limit: Optional[int] = None) -> list[Ticket]:
        return jsonable_encoder(self.tickets[start: start + limit])

    def get_ticket_quantity(self) -> int:
        return len(self.tickets)

    def get_ticket_by_id(self, ticket_id) -> Ticket | None:
        for ticket in self.tickets:
            if ticket.id == ticket_id:
                return ticket
        return None

    def close_ticket(self, ticket_id: str) -> bool:
        self.get_ticket_by_id(ticket_id).close()
        self.export_to_json()
        return True

    def open_ticket(self, ticket_id: str) -> bool:
        self.get_ticket_by_id(ticket_id).open()
        self.export_to_json()
        return True

    def delete_ticket(self, ticket_id: str) -> bool:
        self.tickets.remove(self.get_ticket_by_id(ticket_id))
        self.export_to_json()
        return True

    def get_tickets_with_filters(
            self,
            start: Optional[int] = 0,
            limit: Optional[int] = 20,
            search: Optional[str] = None,
            filters: Optional[Filters] = None) -> dict:

        response = {"tickets": self.tickets, "ticket_quantity": len(self.tickets)}
        if filters is not None:
            if filters.usernames and len(filters.usernames) > 0:
                response["tickets"] = username_filter(response["tickets"], filters.usernames)
            if filters.status and filters.status != "both":
                response["tickets"] = status_filter(response["tickets"], filters.status)
            if filters.date.start or filters.date.end:
                response["tickets"] = date_filter(response["tickets"], filters.date)

        if search is not None and search != "":
            response["tickets"] = search_tickets(response["tickets"], search)

        response["ticket_quantity"] = len(response["tickets"])
        response["tickets"] = jsonable_encoder(ticket_sorter(response["tickets"],
                                                             filters.sorting.field_name,
                                                             filters.sorting.reversed)[start:start + limit])
        return response

    def init_from_structured_data(self, tickets, messages_repository):
        for ticket in tickets:
            context_messages_temp = []
            for message in ticket["context_messages"]:
                context_messages_temp.append(Message(
                    id=message["id"],
                    author=Author(
                        id=message["author"]["id"],
                        name=message["author"]["name"],
                        color=message["author"]["color"],
                        avatar=message["author"]["avatar"]
                    ),
                    timestamp=message["timestamp"],
                    content=message["content"],
                    url=message["url"]
                ))
            self.tickets.append(Ticket(
                id=ticket["id"],
                message=messages_repository.get_message_by_id(message_id=ticket["message"]["id"]),
                context_messages=context_messages_temp,
                timestamp=(ticket["timestamp"]),
                last_status_change=ticket["last_status_change"] if ticket["last_status_change"] is not None else None,
                status=ticket["status"]
            ))

    def init_from_raw_data(self, tickets, messages_repository):
        for ticket in tickets:
            context_messages_temp = []
            for msg_id in ticket["context_messages"]:
                found_msg = messages_repository.get_message_by_id(msg_id)
                context_messages_temp.append(Message(id=found_msg.id,
                                                     author=Author(
                                                         id=found_msg.author.id,
                                                         name=found_msg.author.name,
                                                         color=found_msg.author.color,
                                                         avatar=found_msg.author.avatar
                                                     ),
                                                     timestamp=found_msg.timestamp,
                                                     content=found_msg.content,
                                                     url=found_msg.url))
            self.tickets.append(Ticket(
                id=ticket["id"],
                message=messages_repository.get_message_by_id(message_id=ticket["msg_id"]),
                context_messages=context_messages_temp,
                timestamp=datetime.strptime(ticket["timestamp"], DATE_FORMAT_2),
                last_status_change=datetime.strptime(
                    ticket["ts_last_status_change"], DATE_FORMAT_2)
                if ticket["ts_last_status_change"] is not None else None,
                status=ticket["status"]
            ))
