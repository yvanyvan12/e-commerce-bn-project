import { Request, Response } from "express";
import Order from "../model/orderModels";
import Cart from "../model/CartModels";
import Product from "../model/productModel"; // make sure path and name are correct
import { orderSchema } from "../validation/orderValidation";
import { ZodError } from "zod";

// --------------------------
// Place an order
// --------------------------
export const placeOrder = async (req: Request, res: Response) => {
  try {
    // Validate input (only items + quantity)
    const { items } = orderSchema.parse(req.body);

    // Fetch cart items
    const cartItems = await Cart.find();
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Cart is empty",
      });
    }

    let total = 0;
    const orderItems: { productId: string; quantity: number }[] = [];

    // Validate each product in the cart
    for (const cartItem of cartItems) {
      for (const product of cartItem.products) {
        const productExists = await Product.findById(product.productId);
        if (!productExists) {
          return res.status(400).json({
            success: false,
            data: null,
            message: `Product with ID ${product.productId} not found`,
          });
        }

        const itemTotal = productExists.price * product.quantity;
        total += itemTotal;

        orderItems.push({
          productId: product.productId,
          quantity: product.quantity,
        });
      }
    }

    // Create new order
    const order = new Order({
      items: orderItems,
      total,
    });

    await order.save();

    // Clear cart
    await Cart.deleteMany({});

    res.status(201).json({
      success: true,
      data: order,
      message: "Order placed successfully",
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: error.issues.map((e) => e.message).join(", "),
      });
    }
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to place order",
    });
  }
};

// --------------------------
// Get all orders
// --------------------------
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    // Make sure Product model is imported before populate
    const orders = await Order.find().populate({
      path: "items.productId",
      model: "Product",
      strictPopulate: false, // prevents errors if productId doesn't exist
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to fetch orders",
    });
  }
};

// --------------------------
// Get order by ID
// --------------------------
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "items.productId",
      model: "Product",
      strictPopulate: false,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Order not found",
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error fetching order",
    });
  }
};

// --------------------------
// Cancel order
// --------------------------
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to cancel order",
    });
  }
};
