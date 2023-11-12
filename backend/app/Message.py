from datetime import datetime

from pydantic import BaseModel

from app.Author import Author

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


class Message(BaseModel):
    id: str
    author: Author
    timestamp: datetime
    content: str
    url: str

    def to_csv_string(self):
        return "{0};{1};{2};{3};{4}".format(self.id, self.author.id, self.timestamp.strftime(DATE_FORMAT),
                                            self.content, self.url)