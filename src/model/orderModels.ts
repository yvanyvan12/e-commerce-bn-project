// Import mongoose properly
import mongoose, { Schema, Document, model } from 'mongoose';

// Define an interface for the Order document
export interface IOrder extends Document {
  items: {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
  total: number;
  createdAt: Date;
}

// Create the schema
const orderSchema: Schema<IOrder> = new Schema(
  {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the model
const Order = model<IOrder>('Order', orderSchema);

export default Order;
