import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import productRouter from "./routes/productRoutes"
import cartRouter from "./routes/cartroutes"
import orderRouter from "./routes/orderRoutes" 
import mongoose from "mongoose"
import mainRouter from "./routes/userPath"
const port = 3000
const app = express()
app.use(express.json())




mongoose.connect("mongodb+srv://yvanyvan0788_db_user:6eD4IrY6K8qgGmEi@cluster0.0bs7vij.mongodb.net/")
  .then(()=>{
    console.log("well connected")
     app.listen(port ,()=>{
  console.log(`your server is up and running on port : ${port}`)
})
  })
 
  .catch(err=>{
    console.log("failed to connect ", err.message)
  })

  app.use("/products",productRouter)
  app.use("/cart", cartRouter)  
  app.use("/order", orderRouter)
  app.use("/user", mainRouter)





