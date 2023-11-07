from pydantic import BaseModel


class Date(BaseModel):
    start: str | None = None
    end: str | None = None

class Filters(BaseModel):
    usernames: list[str] | None = None
    date: Date
    status: str | None = None








