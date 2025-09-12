import express from "express";
import { addToCart, getAllCarts, getCartById, updateCart, deleteCart } from "../controllers/cartControllers";

const cartRouter = express.Router();

cartRouter.post("/", addToCart);
cartRouter.get("/", getAllCarts);
cartRouter.get("/:id", getCartById);
cartRouter.put("/:id", updateCart);
cartRouter.delete("/:id", deleteCart);

export default cartRouter;
