import json
from datetime import datetime
from typing import Optional
import copy

from app.Filters import Filters, Date

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def username_filter(tickets: dict, usernames: list[str]) -> list[dict]:
    new_tickets = []
    for ticket in tickets:
        if ticket["main_message"]["author"]["name"] in usernames:
            new_tickets.append(ticket)

    print(filter(lambda t: True if t["main_message"]["author"]["name"] in usernames else False, tickets))
    return new_tickets


def status_filter(tickets: dict, status: str) -> list[dict]:
    new_tickets = []
    for ticket in tickets:
        if ticket["status"] == status:
            print(ticket["status"])
            new_tickets.append(ticket)
    return new_tickets


def date_filter(tickets: dict, date: Date) -> list[dict]:
    new_tickets = []
    for ticket in tickets:
        ticket_date = datetime.strptime(ticket["timestamp"].split('.')[0], DATE_FORMAT)
        start_date = datetime.strptime(date.start, DATE_FORMAT) if date.start else ticket_date
        end_date = datetime.strptime(date.end, DATE_FORMAT) if date.end else ticket_date
        if start_date <= ticket_date <= end_date:
            new_tickets.append(ticket)
    return new_tickets


def ticket_sorter(detailed_tickets, field_name, reverse) -> list[dict]:
    match field_name:
        case "date":
            return sorted(detailed_tickets, key=lambda t: t['timestamp'], reverse=reverse)
        case "username":
            return sorted(detailed_tickets, key=lambda t: t['main_message']['author']['name'], reverse=reverse)
        case "status":
            return sorted(detailed_tickets, key=lambda t: t['status'], reverse=reverse)
        case _:
            return detailed_tickets


def search_tickets(tickets, text) -> list[dict]:
    new_tickets = []
    for ticket in tickets:
        if text.lower() in ticket["main_message"]["content"].lower():
            new_tickets.append(ticket)
    return new_tickets


class TicketRepository:
    def __init__(self, filepath: str):
        self.filepath = filepath
        with open(filepath) as json_file:
            self.data = json.load(json_file)

    def get_tickets(self, start: Optional[int] = 0, limit: Optional[int] = None) -> list[dict]:
        return self.data["tickets"][start: start + limit]

    def get_tickets_with_details(
            self,
            start: Optional[int] = 0,
            limit: Optional[int] = None,
            search: Optional[str] = None,
            filters: Optional[Filters] = None) -> dict:
        response = {"tickets": copy.deepcopy(self.data["tickets"])}
        for ticket in response["tickets"]:
            ticket["main_message"] = self.get_message_by_id(ticket["msg_id"])
            ticket["detailed_context_messages"] = []
            for message in ticket["context_messages"]:
                ticket["detailed_context_messages"].append(self.get_message_by_id(message))

        if filters is not None:
            if filters.usernames and len(filters.usernames) > 0:
                response["tickets"] = username_filter(response["tickets"], filters.usernames)
            if filters.status != "both":
                response["tickets"] = status_filter(response["tickets"], filters.status)
            if filters.date.start or filters.date.end:
                print(filters.date.start)
                response["tickets"] = date_filter(response["tickets"], filters.date)

        if search is not None and search != "":
            response["tickets"] = search_tickets(response["tickets"], search)

        response["ticket_quantity"] = len(response["tickets"])
        response["tickets"] = ticket_sorter(response["tickets"],
                                            filters.sorting.field_name,
                                            filters.sorting.reversed)[start:start+limit]
        return response

    def get_message_by_id(self, msg_id: str) -> dict:
        for message in self.data["messages"]:
            if message["id"] == msg_id:
                return message

    def get_messages(self, start: Optional[int] = 0, limit: Optional[int] = None) -> list[dict]:
        return self.data["messages"][start: start + limit]

    def close_ticket(self, ticket_id: str) -> bool:
        for ticket in self.data["tickets"]:
            if ticket["id"] == ticket_id:
                ticket["status"] = "closed"
                with open(self.filepath, 'w') as json_file:
                    json.dump(self.data, json_file, indent=4)
                return True
        return False

    def open_ticket(self, ticket_id: str) -> bool:
        for ticket in self.data["tickets"]:
            if ticket["id"] == ticket_id:
                ticket["status"] = "open"
                with open(self.filepath, 'w') as json_file:
                    json.dump(self.data, json_file, indent=4)
                return True
        return False

    def delete_ticket(self, ticket_id: str) -> bool:
        for ticket in self.data["tickets"]:
            if ticket["id"] == ticket_id:
                self.data["tickets"].remove(ticket)
                with open(self.filepath, 'w') as json_file:
                    json.dump(self.data, json_file, indent=4)
                return True
        return False

    def get_ticket_amount(self) -> int:
        return len(self.data["tickets"])

    def get_usernames(self) -> list[str]:
        usernames = []
        for ticket in self.data["tickets"]:
            currentUsername = self.get_message_by_id(ticket["msg_id"])["author"]["name"]
            if currentUsername not in usernames:
                usernames.append(currentUsername)
        return usernames
