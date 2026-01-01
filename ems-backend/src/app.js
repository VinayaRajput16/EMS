import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes/index.js";
import notFound from "./common/middleware/notFound.js";
import errorHandler from "./common/middleware/errorHandler.js";
import eventRoutes from "./modules/event/eventRoutes.js";
import ticketRouter from "./modules/ticket/ticketRoutes.js";
import orderRouter from "./modules/order/orderRoutes.js";
import analyticsRouter from "./modules/analytics/analyticsRoutes.js";
import seatAllocationRouter from "./modules/seats/seatAllocationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// 1️⃣ Register routes FIRST
registerRoutes(app);
app.use("/events", eventRoutes);
app.use("/api", ticketRouter);
app.use("/api", orderRouter);
app.use("/api", seatAllocationRouter);
app.use("/api", analyticsRouter);

// 2️⃣ 404 handler (only if no route matched)
app.use(notFound);

// 3️⃣ Error handler LAST
app.use(errorHandler);

export default app;
