import json

from app.Filters import Filters
from app.file_reader import FileReader
from app.repositories.author_repository import AuthorRepository
from app.repositories.message_repository import MessageRepository
from app.repositories.ticket_repository import TicketRepository
import uvicorn
from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TICKET_FILEPATH = "data/awesome_tickets.json"
STRUCTURED_FILEPATH = "data/tickets.json"
fr = FileReader(TICKET_FILEPATH, STRUCTURED_FILEPATH)
author_repository = fr.init_author_repository()
message_repository = fr.init_message_repository(author_repository)
ticket_repository = fr.init_ticket_repository(message_repository)


@app.get("/healthz")
async def root():
    return "OK"


@app.get("/users/usernames")
async def get_usernames(
        author_repo: AuthorRepository = Depends(lambda: author_repository)):
    usernames = author_repo.get_usernames()
    return JSONResponse(usernames, status_code=200)


@app.get("/tickets")
async def get_tickets(
        start: int = 0,
        limit: int = 20,
        l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    tickets = l_ticket_repository.get_tickets(start=start, limit=limit)
    return JSONResponse(json.dumps(tickets), status_code=200)


@app.get("/authors")
async def get_authors(author_repo: AuthorRepository = Depends(lambda: author_repository)):
    return JSONResponse(author_repo.get_authors())


@app.get("/messages")
async def get_messages(message_repo: MessageRepository = Depends(lambda: message_repository)):
    return JSONResponse(message_repo.get_messages())


@app.post("/tickets/details")
async def get_tickets_with_filters(
        start: Optional[int] = 0,
        limit: int = 20,
        l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository),
        search: str = "",
        filters: Optional[Filters] = None):
    tickets = l_ticket_repository.get_tickets_with_filters(start=start, limit=limit, filters=filters, search=search)
    print(f"start: {start}, limit: {limit}, search: {search}, filters: {filters}")
    return JSONResponse(tickets, status_code=200)


@app.get("/messages/{msg_id}")
async def get_message(msg_id: str, message_repo: MessageRepository = Depends(lambda: message_repository)):
    message = message_repo.get_message_by_id(message_id=msg_id)
    return JSONResponse(message, status_code=200)


@app.get("/tickets/amount")
async def get_ticket_amount(l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    amount = l_ticket_repository.get_ticket_quantity()
    return JSONResponse(amount, status_code=200)


@app.get("/messages")
async def get_messages(
        limit: int = 20,
        message_repo: MessageRepository = Depends(lambda: message_repository)):
    messages = message_repo.get_messages(limit=limit)
    return JSONResponse(messages, status_code=200)


@app.patch("/tickets/close/{ticket_id}")
async def close_ticket(
        ticket_id: str,
        l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    closed = l_ticket_repository.close_ticket(ticket_id)
    return JSONResponse(closed, status_code=200)


@app.patch("/tickets/open/{ticket_id}")
async def open_ticket(
        ticket_id: str,
        l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    opened = l_ticket_repository.open_ticket(ticket_id)
    return JSONResponse(opened, status_code=200)


@app.delete("/tickets/delete/{ticket_id}")
async def delete_ticket(
        ticket_id: str,
        l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    deleted = l_ticket_repository.delete_ticket(ticket_id)
    return JSONResponse(deleted, status_code=200)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
