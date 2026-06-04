"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const requestBodyLimit = '10mb';
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json({ limit: requestBodyLimit }));
app.use(express_1.default.urlencoded({ extended: true, limit: requestBodyLimit }));
// Mount API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.get('/', (_req, res) => {
    res.json({ message: 'TaskPlanet Social API (TypeScript) is running smoothly.' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server executing in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
