## Rutas

GET  /
: login html

GET  /room/?:roomId&:userId
: room html

## API

POST /api/room
: new Room

PUT  /api/room/:roomId
: enter Room

GET  /api/message/:roomId/:userId
: msg para usuario en room

POST /api/message/:roomId/:userId
: envia mensaje de usuario en room


## TODO

- [x] DELETE /api/room/:roomId/:userId
- [ ] DELETE /api/message/:roomId/:userId
