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
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";


configDotenv();


const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

// Load the YAML file
const swaggerDocument = YAML.load('documentation.yaml');

// Use Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// logging the requests
app.use(logger);

// cors middleware
corsMiddleware(app);

// db connection
connectDB();

// API endpoints for auth
app.use("/api/auth", authRoutes);

// API endpoints for reservations
app.use("/api/reservations", autho,reservationRoutes);

// API for reports
app.use("/api/report",autho, reportRoutes);

// serve the uploads folder
app.use('/uploads', express.static('uploads'));

// API for email and contact us 
app.use('/api/mail',mailRoutes);

// API for user profile
app.use('/api/user',autho,userRoutes);


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})
