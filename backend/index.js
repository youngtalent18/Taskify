import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import authRoute from './routes/authRoute.js';
import taskRoute from './routes/taskRoute.js';
import dns from 'dns';
import cookieParser from 'cookie-parser';

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
    cors({
        origin: [
            process.env.CLIENT_URL || "https://taskify-nu-gold.vercel.app"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute);

const PORT = process.env.PORT || 6060;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});