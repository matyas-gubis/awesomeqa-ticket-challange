from pydantic import BaseModel


class Date(BaseModel):
    start: str | None = None
    end: str | None = None


class SortBy(BaseModel):
    field_name: str | None = None
    reversed: bool


class Filters(BaseModel):
    usernames: list[str] | None = None
    date: Date
    status: str | None = None
    sorting: SortBy
