"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./presentation/routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./presentation/routes/adminRoutes"));
const config_1 = require("./config/config");
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
// import { ChatRepositoryImpl } from './infrastructure/repositoryImpl/chatRepositoryImpl'
// import { ChatService } from './application/services/chatService'
// import { SendMessage } from './domain/useCases/sendMessage'
// import { ChatController } from './presentation/controllers/chatController'
const chatRoutes_1 = __importDefault(require("./presentation/routes/chatRoutes"));
// Initialize Express app
const app = (0, express_1.default)();
const port = process.env.PORT;
const url = process.env.URL;
// socket server initialzation
const server = http_1.default.createServer(app);
// for handling multiple origins
const allowedOrigins = [];
if (config_1.config.CLIENT_SIDE_URL)
    allowedOrigins.push(config_1.config.CLIENT_SIDE_URL);
if (config_1.config.PRODUCTION_CLIENT_SIDE_URL)
    allowedOrigins.push(config_1.config.PRODUCTION_CLIENT_SIDE_URL);
if (config_1.config.PRODUCTION_CLIENT_SIDE_WWW_URL)
    allowedOrigins.push(config_1.config.PRODUCTION_CLIENT_SIDE_WWW_URL);
// CORS Options
const corsOptions = {
    origin: allowedOrigins.length > 0 ? allowedOrigins : [],
    methods: 'GET,PATCH,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ['content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204
};
//middlewares
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//routes
// Database connection
mongoose_1.default.connect(config_1.config.MONGO_URI || '', {}).then(() => {
    console.log('mongodb is connected');
}).catch((err) => {
    console.log('failed to connect to mongodb', err);
});
// Dependency Injection Setup
// const ChatRepository= new ChatRepositoryImpl()
//Routes
app.use('/api', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
//Initialize socket io
// CORS pre-flight
app.options('*', (0, cors_1.default)(corsOptions));
// Error handling middleware
// Starting the server
server.listen(port, () => {
    console.log(`Server is running at ${url}:${port}`);
});
