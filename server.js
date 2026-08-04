const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serwowanie plików statycznych z folderu 'public'
app.use(express.static(__dirname + '/public'));

// Obsługa czystego adresu /view
app.get('/view', (req, res) => {
    res.sendFile(__dirname + '/public/view.html');
});

// Socket.io - obsługa transmisji na żywo
io.on('connection', (socket) => {
    console.log('[SOCKET] Nowy klient podłączony, ID:', socket.id);

    socket.on('sendToView', (data) => {
        console.log('[SOCKET] Otrzymano utwór od admina:', data.title);
        io.emit('updateView', data);
    });

    socket.on('disconnect', () => {
        console.log('[SOCKET] Klient rozłączył się:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}`);
});