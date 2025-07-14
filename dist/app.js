"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const games_routes_1 = __importDefault(require("./routes/games.routes"));
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/games', games_routes_1.default);
app.use('/api/news', news_routes_1.default);
app.use('/api/users', users_routes_1.default);
// Error handling
app.use(error_middleware_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
