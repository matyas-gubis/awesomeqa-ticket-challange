from datetime import datetime

from pydantic import BaseModel


class Date(BaseModel):
    start: datetime | None = None
    end: datetime | None = None


class SortBy(BaseModel):
    field_name: str | None = None
    reversed: bool


class Filters(BaseModel):
    usernames: list[str] | None = None
    date: Date
    status: str | None = None
    sorting: SortBy
