import json

from app.repositories.author_repository import AuthorRepository
from app.repositories.message_repository import MessageRepository
from app.repositories.ticket_repository import TicketRepository


class FileReader:
    def __init__(self, unstructured_filepath: str, structured_filepath):
        try:
            with open(structured_filepath) as structured_file:
                try:
                    print("trying to read from structured file")
                    self.data = json.load(structured_file)
                except:
                    with open(unstructured_filepath) as json_file:
                        print("structured file exists but empty. trying to read from unstructured file")
                        self.data = json.load(json_file)
        except:
            with open(unstructured_filepath) as json_file:
                print("structured file does not exist. trying to read from unstructured file")
                self.data = json.load(json_file)

    def init_author_repository(self) -> AuthorRepository:
        try:
            print("trying to init author repo as unstructured ")
            return AuthorRepository([ticket["message"] for ticket in self.data])

        except:
            print("cannot init authors as unstructured, trying structured")
            return AuthorRepository(self.data["messages"])

    def init_message_repository(self, author_repository: AuthorRepository) -> MessageRepository:
        try:
            print("trying to init message repo as unstructured ")
            return MessageRepository([ticket["message"] for ticket in self.data], author_repository)

        except:
            print("cannot init messages as unstructured, trying structured")
            return MessageRepository(self.data["messages"], author_repository)

    def init_ticket_repository(self, message_repository: MessageRepository) -> TicketRepository:
        try:
            print("trying to init ticket repo as unstructured ")
            return TicketRepository(self.data["tickets"], message_repository)

        except:
            print("cannot init tickets as unstructured, trying structured")
            return TicketRepository(self.data, message_repository)


