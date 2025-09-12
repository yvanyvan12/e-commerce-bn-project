import express, { Router } from "express";
import { 
  signin, 
  signup, 
  getAllUsers, 
  getUserById, 
  testRoute 
} from "../controllers/Usercontroller";
import productRouter from "./productRoutes";

// Create routers
const userRouter = Router();
const mainRouter = Router();

// ======================
// GET ROUTES
// ======================
userRouter.get("/test", testRoute);              // GET /user/user/test (for testing)
userRouter.get("/users", getAllUsers);           // GET /user/user/users (get all users)
userRouter.get("/users/:id", getUserById);       // GET /user/user/users/:id (get user by ID)

// ======================
// POST ROUTES  
// ======================
userRouter.post("/signup", signup);              // POST /user/user/signup (create new user)
userRouter.post("/signin", signin);              // POST /user/user/signin (login user)
userRouter.post("/loo", signin);                 // POST /user/user/loo (your existing route)

// ======================
// MOUNT ROUTES
// ======================
mainRouter.use("/user", userRouter);             // All user routes will have /user prefix
mainRouter.use("/product", productRouter);       // All product routes will have /product prefix

export default mainRouter;