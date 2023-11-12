from fastapi.encoders import jsonable_encoder

from app.Author import Author


class AuthorRepository:
    def __init__(self, messages: list):
        self.authors: set[Author] = set()

        for message in messages:
            try:
                self.authors.add(Author(
                    id=message["author"]["id"],
                    name=message["author"]["name"],
                    color=message["author"]["color"],
                    avatar=message["author"]["avatar_url"]
                ))
            except:
                self.authors.add(Author(
                    id=message["author"]["id"],
                    name=message["author"]["name"],
                    color=message["author"]["color"],
                    avatar=message["author"]["avatar"]
                ))

    def export_csv(self):
        with open("data/authors.csv", mode="w") as new_file:
            structured_authors_str = ""
            for author in self.authors:
                structured_authors_str += (author.to_csv_string() + "\n")
            new_file.write(structured_authors_str)
        print("data_written")

    def get_author_by_id(self, author_id: str) -> Author | None:
        for author in self.authors:
            if author.id == author_id:
                return author
        return None

    def get_authors(self) -> list[Author]:
        return jsonable_encoder(list(self.authors))

    def get_usernames(self) -> list[str]:
        return [username.name for username in self.authors]
