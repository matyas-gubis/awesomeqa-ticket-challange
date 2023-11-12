from fastapi.encoders import jsonable_encoder

from app.Message import Message
from app.repositories.author_repository import AuthorRepository


class MessageRepository:
    def __init__(self, messages: list, author_repository: AuthorRepository):
        self.messages: list[Message] = []

        try:
            for message in messages:
                self.messages.append(Message(
                    id=message["id"],
                    author=author_repository.get_author_by_id(message["author"]["id"]),
                    timestamp=message["timestamp"],
                    content=message["content"],
                    url=message["msg_url"]
                ))
        except:
            for message in messages:
                self.messages.append(Message(
                    id=message["id"],
                    author=author_repository.get_author_by_id(message["author"]["id"]),
                    timestamp=message["timestamp"],
                    content=message["content"],
                    url=message["url"]
                ))

    def export_csv(self):
        with open("data/messages.csv", mode="w", encoding='utf-8') as new_file:
            structured_messages_str = ""
            for message in self.messages:
                structured_messages_str += (message.to_csv_string() + "\n")
            new_file.write(structured_messages_str)
        print("data_written")

    def get_message_by_id(self, message_id: str) -> Message:
        for message in self.messages:
            if message.id == message_id:
                return message

    def get_messages(self, limit: int) -> list[Message]:
        return jsonable_encoder(self.messages[:limit])

