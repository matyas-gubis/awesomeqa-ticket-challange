from pydantic import BaseModel


class Author(BaseModel):
    id: str
    name: str
    color: str
    avatar: str

    def to_csv_string(self):
        return self.id + ";" + self.name + ';' + self.color + ";" + self.avatar + ";"

    def __hash__(self):
        return hash(self.id)

    def __eq__(self, other):
        if isinstance(other, self.__class__):
            return self.id == other.id
        return False
