from app.Filters import Filters
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
ticket_repository = TicketRepository(filepath=TICKET_FILEPATH)


@app.get("/healthz")
async def root():
    return "OK"


@app.get("/users/usernames")
async def get_usernames(
        l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    usernames = l_ticket_repository.get_usernames()
    return JSONResponse(usernames, status_code=200)


@app.get("/tickets")
async def get_tickets(
        limit: int = 20,
        l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    tickets = l_ticket_repository.get_tickets(limit=limit)
    return JSONResponse(tickets, status_code=200)


@app.post("/tickets/details")
async def get_tickets_with_details(
        start: Optional[int] = 0,
        limit: int = 20,
        l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository),
        search: str = "",
        filters: Optional[Filters] = None):
    tickets = l_ticket_repository.get_tickets_with_details(start=start, limit=limit, filters=filters, search=search)
    return JSONResponse(tickets, status_code=200)


@app.get("/message/{msg_id}")
async def get_message(msg_id: str, l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    message = l_ticket_repository.get_message_by_id(msg_id=msg_id)
    return JSONResponse(message, status_code=200)


@app.get("/tickets/amount")
async def get_ticket_amount(l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    amount = l_ticket_repository.get_ticket_amount()
    return JSONResponse(amount, status_code=200)


@app.get("/messages")
async def get_messages(
        limit: int = 20,
        l_ticket_repository: TicketRepository = Depends(lambda: ticket_repository)):
    messages = l_ticket_repository.get_messages(limit=limit)
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
