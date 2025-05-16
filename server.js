import express from "express";
import logger from "./middlewares/loggerMiddleware.js";
import connectDB from "./config/dbconnect.js";
import authRoutes from "./routes/authRoutes.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import autho from "./middlewares/authoMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import { configDotenv } from "dotenv";
import mailRoutes from "./routes/mailRoutes.js";

configDotenv();


const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
// @desc logging the requests
app.use(logger);

// @desc cors middleware
corsMiddleware(app);

//@desc db connection
connectDB();

//@desc API endpoints for auth
app.use("/api/auth", authRoutes);

// @desc API endpoints for reservations
app.use("/api/reservations", autho,reservationRoutes);

// @desc API for reports
app.use("/api/report",autho, reportRoutes);

//@desc serve the uploads folder
app.use('/uploads', express.static('uploads'));

//@desc API for email and contact us 
app.use('/api/mail',mailRoutes);

//@desc API for user profile
app.use('/api/user',autho,userRoutes);


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})