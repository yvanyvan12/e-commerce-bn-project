import express from "express";
import { placeOrder, getAllOrders, getOrderById, cancelOrder } from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/", placeOrder);
orderRouter.get("/", getAllOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.delete("/:id", cancelOrder);

export default orderRouter;