from datetime import datetime

from pydantic import BaseModel

from app.Message import Message
from app.repositories.message_repository import MessageRepository

DATE_FORMAT = "%Y-%m-%d %H:%M:%S.%f"


class Ticket(BaseModel):
    id: str
    message: Message
    status: str
    context_messages: list[Message]
    timestamp: datetime
    last_status_change: datetime | None = None

    def to_csv_string(self) -> str:
        return "{0}{1}{2}{3}{4}".format(self.id, str(self.message.id), self.status, self.contact_messages_as_str(),
                                        self.timestamp.strftime(DATE_FORMAT),
                                        self.last_status_change.strftime(DATE_FORMAT))

    def contact_messages_as_str(self):
        msgs = ""
        for msg in self.context_messages:
            msgs += str(msg.id) + ","
        return msgs

    def close(self):
        self.status = "closed"
        self.last_status_change = datetime.now()

    def open(self):
        self.status = "open"
        self.last_status_change = datetime.now()



