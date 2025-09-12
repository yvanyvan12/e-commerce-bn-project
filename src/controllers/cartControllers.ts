import { Request, Response } from "express";
import Cart from "../model/CartModels";
import { cartSchema } from "../validation/cartValidation";
import { ZodError } from "zod";

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    // Validate with Zod
    const parsedData = cartSchema.parse(req.body);

    const cart = new Cart(parsedData);
    await cart.save();

    res.status(201).json({
      success: true,
      data: cart,
      message: "Item added to cart",
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: error.issues.map((issue) => issue.message).join(", "),
      });
    }

    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to add item to cart",
    });
  }
};

// Get all carts
export const getAllCarts = async (req: Request, res: Response) => {
  try {
    const carts = await Cart.find();
    res.json({ success: true, data: carts });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to fetch carts",
    });
  }
};

// Get cart by ID
export const getCartById = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Cart not found",
      });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error fetching cart",
    });
  }
};

// Update cart
export const updateCart = async (req: Request, res: Response) => {
  try {
    // Validate with Zod
    const parsedData = cartSchema.parse(req.body);

    const cart = await Cart.findByIdAndUpdate(req.params.id, parsedData, {
      new: true,
      runValidators: true,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Cart not found",
      });
    }

    res.json({ success: true, data: cart, message: "Cart updated" });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: error.issues.map((issue) => issue.message).join(", "),
      });
    }

    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to update cart",
    });
  }
};

// Delete cart
export const deleteCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Cart not found",
      });
    }

    res.json({ success: true, data: cart, message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to delete cart",
    });
  }
};
