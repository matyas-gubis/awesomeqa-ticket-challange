# Awesome ticket challenge

### Backend

Steps to setup the backend environment:

1. [Download the ticket data here](https://drive.google.com/file/d/1Bvk2mW5t3GfkqTkpURiFpaLuqrUckzUX/view?usp=sharing)
2. Place it in data/awesome_tickets.json
3. Run `make setup`
4. Run `make run`
5. Try it by calling [http://localhost:5001/tickets](http://localhost:5001/tickets)

### Frontend

1. Run `make setup`
2. Run `make run`
3. Open it: [http://localhost:3002](http://localhost:3002)


### Features
In this challange I created a fullstack application, which gives discord server moderators to handle tickets.

#### Some of the key features are:
- filtering for:
  - status of the ticket
  - usernames
  - date of message
- the possibility to search in the messages
- sorting based on:
  - date
  - username
  - status
- closing tickets
- reopening tickets
- deleting tickets permanently
- revealing the context messages for given tickets
- opening the messages directly in discord

#### There also some mentionable things in the backend:
- on the first server startup, the data will be read from an unstructured data
- then the data will be structured to classes, leaving all the necessary data in the structure
- this structured data will be then saved as a new file
- on any other server startup, this new - now structured - file will be read, thus saving a little computing power
- there is also an option for saving the authors, messages and the tickets to a csv file
