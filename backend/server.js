const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var clients = [];
var facts = [];

app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Facts Event service listening at http://localhost:${PORT}`)
})

function eventsHandler(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);
  

  const data = `facts: ${JSON.stringify(facts, null, 2)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response
  };
  clients.push(newClient);
  console.log(`New connection with client ${clientId} opened!`);

  request.on('close', () => {
    console.log(`Connection with client ${clientId} closed!`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

app.get('/events', eventsHandler);

function emitEventToAllClients() {
  clients.forEach((client) => {
    client.response.write(`facts: ${JSON.stringify(facts, null, 2)}\n\n`);
  })
}

async function addFact(request, response, next) {
  const newFact = request.body;
  facts.push(newFact);
  console.log(facts);
  response.json(newFact);
  return emitEventToAllClients();
}

app.post('/fact', addFact);