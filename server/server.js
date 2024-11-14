import express from "express";
import { config } from 'dotenv';
import http from 'http'; 
import { Server } from 'socket.io';
config();

import cookieParser from 'cookie-parser';
import cors from 'cors';

//IMPORT ROUTES
import authRoute from './routes/auth.routes.js';
import userRoute from './routes/user.routres.js';
import aiChatRoute from './routes/aichat.routes.js';
import filesRoute from './routes/upload.routes.js';


// CORS setup
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    process.env.SERVER_URL,
    '*',
];

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            console.log('URL ORIGIN', origin);
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS', 'ORIGIN>', origin));
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cookieParser());
app.use(express.json());


const corsOptions = {
    origin: function (origin, callback) {
        console.log('URL ORIGIN', origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS', 'ORIGIN>', origin));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

//DOCs
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerJSDocs = YAML.load('./api.yaml');
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

// Import DB connection
import './connection/db.js';
import { aiChat } from "./controllers/aichat.controllers.js";
import { ChatId } from "./middleware/auth.js";

// Routes
app.get('/', (req, res) => {
    res.status(200).json('Home GET Request');
});
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/aiChat', aiChatRoute);
app.use('/api/file', filesRoute)



// Setup socket.io connection
io.use((socket, next) => {
    ChatId(socket.request, socket.request.res || {}, next);
  });
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    socket.on('aiChat', async (data) => {
      try {
        const response = await aiChat({ chatId: socket.request.chatId, body: { message: data.message } });
        socket.emit('aiChatResponse', response.data);
      } catch (error) {
        socket.emit('aiChatResponse', { msg: 'AI unable to respond' });
      }
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });


// Start server with socket
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});