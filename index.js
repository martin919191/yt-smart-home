var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');
const Home = require('./lib/Home');

/**** CONSTANT DEFINITION ******/
const STATUS_ON = '1';
const STATUS_OFF = '0';
const ENDPOINT_ID_PREFIX = 'endpoint-';
const DEVICE_ID = 1
const DEVICE_TYPE = 'B'
const DEFAULT_BRIDGE_ID = 1 // 0 is default bridge ID

var home = new Home();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/arduino.html');
});

app.post('/status', (req, res) => {
  console.log(`Device status ${home.getEndpointStatus(req.body['id'])}`);
  res.send({ "status": home.getEndpointStatus(req.body['id']) });
});

app.post('/switchStatus', (req, res) => {
  console.log(`Device status was ${home.getEndpointStatus(req.body['id'])}, now it's ${home.switchEndpointStatus(req.body['id'], req.body['status'])}`);
  //if (home.getEndpointStatus(req.body['id']) == "ON") (io.sockets.emit('STATUS   ', 'ON  '));
  //if (home.getEndpointStatus(req.body['id']) == "OFF") (io.sockets.emit('STATUS   ', 'OFF '));
  var endpointIdToSend = String.fromCharCode(req.body['id'].replace(ENDPOINT_ID_PREFIX, ""));
  console.log(`Sending new status to ${endpointIdToSend}`);
  var valueToSend = endpointIdToSend + "" + ((home.getEndpointStatus(req.body['id']) == "ON")?STATUS_ON:STATUS_OFF);
  console.log(`Emitting - ${valueToSend}`);
  io.sockets.emit('SWITCH', valueToSend);
  res.send({ "status": home.getEndpointStatus(req.body['id']) });
});

app.get('/broadcast', (req, res) => {
  io.sockets.emit('broadcast', 'HOLA');
  res.send(200);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('msg', (msg) => {
    io.emit('msg', msg);
  });

  socket.on('device-state', (msg) => {
    console.log(msg);
    var newStatus = String.fromCharCode(msg['state'])==STATUS_ON?'ON':'OFF';
    var id = ENDPOINT_ID_PREFIX + msg['device-id'];
    home.switchEndpointStatus(id, newStatus);
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});