import json
from typing import Optional
import copy


class TicketRepository:
    def __init__(self, filepath: str):
        self.filepath = filepath
        with open(filepath) as json_file:
            self.data = json.load(json_file)

    def get_tickets(self, start: Optional[int] = 0, limit: Optional[int] = None) -> list[dict]:
        return self.data["tickets"][start: start + limit]

    def get_tickets_with_details(
            self, status: Optional[str] = None,
            start: Optional[int] = 0,
            limit: Optional[int] = None) -> list[dict]:
        new_tickets = copy.deepcopy(self.data["tickets"])
        for ticket in new_tickets:
            if status is not None:
                if ticket['status'] != status:
                    continue
            ticket["main_message"] = self.get_message_by_id(ticket["msg_id"])
            ticket["detailed_context_messages"] = []
            for message in ticket["context_messages"]:
                ticket["detailed_context_messages"].append(self.get_message_by_id(message))

        return new_tickets[start: start + limit]

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
