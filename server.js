const express = require('express');
const path = require('path');
var port = 3000;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const multer = require('multer')
var online = 0;
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
const storage = multer.diskStorage({ destination: function (req, file, cb) {
    cb(null,"./public")
},
filename: (req, file, cb) => {
    var name = Date.now() + '-' + file.originalname
    io.on('connection', (socket) => {
        socket.broadcast.emit('imgR', name)
    })
     cb(null, name)
}
})
const uploads = multer({storage})
app.post('/upload', uploads.single("file"), (req, res) => {
    res.status(201).send('<script>window.location.href = "/"</script>')
})
app.use(function(req,res){
    res.status(404).render('404page.html');
});
app.use('/', (req, res) => {
    res.render('index.html')
    
})
app.get('/favicon.ico', (req, res) => {
    res.render('favicon.ico')
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
