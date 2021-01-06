var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');
const Home = require('./lib/Home');

var home = new Home();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/arduino.html');
});

app.post('/status', (req, res) => {
  console.log(`Device status ${home.getEndpointStatus(req.body['id'])}`);
  res.send({"status": home.getEndpointStatus(req.body['id'])});
});

app.post('/switchStatus', (req, res) => {
  console.log(`Device status was ${home.getEndpointStatus(req.body['id'])}, now it's ${home.switchEndpointStatus(req.body['id'], req.body['status'])}`);
  res.send({"status": home.getEndpointStatus(req.body['id'])});
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

  socket.on('event_name', (msg) => {
    console.log(msg);
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});