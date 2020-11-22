const express = require('express');
const path = require('path');
var port = 8080;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var online = 0;
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use(function(req,res){
    res.status(404).render('404page.html');
});
app.use('/', (req, res) => {
    res.render('index.html')
    
})


let messages = [];

io.on('connection', socket => {
    online++;
    socket.broadcast.emit('online', online)
    console.log(online)
console.log(`socket  conectado id: ${socket.id }`)
socket.emit('previousMessage', messages)
socket.on('sendMessage', data => {
    messages.push(data)
    socket.broadcast.emit('receivedMessage', data)
})
})


server.listen(port)
console.log('servidor iniciado na porta: '+port)
