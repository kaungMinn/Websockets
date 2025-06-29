import express from 'express';
import {Server} from 'socket.io';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;
const ADMIN = "Admin";

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

// state
const UsersState = {
    users: [],
    setUsers: function(newUsersArray){
        this.users = newUsersArray
    }
}

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
});

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);

    //Upon connection - only to user
    socket.emit('message', 'Welcome to Chat App!');

    //Upon connection - to all others
    socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}`)

    //Listening for a message event
    socket.on('message', data => {
        console.log(data);
        io.emit('message',` ${socket.id.substring(0,5)}: ${data.test}`)
    })

    //When user disconnect - to all others
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}`)
    });

    //Listen for activity
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
});

function buildMsg(name, text){
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}

//User function
function activateUser(id, name, room){
    const user = {id, name, room};
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== ud),
        user
    ])
    return user;
}