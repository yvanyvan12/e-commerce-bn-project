import { User } from "../model/userModels";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../utils/tokengenerator";
import bcrypt from "bcryptjs";

// SIGNUP FUNCTION (Register new user)
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, username, userRole } = req.body;

    // Validate required fields
    if (!email || !password || !username) {
      return res.status(400).json({ 
        message: "Email, password, and username are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userRole: userRole || 'user'
    });

    // Save user to DB first
    await newUser.save();

    // Generate token after user is saved
    try {
      const token = generateAccessToken(newUser);
      newUser.accessToken = token;
      await newUser.save();
    } catch (tokenError) {
      console.log("Token generation failed, but user created successfully");
    }

    // Return success response
    return res.status(201).json({ 
      message: "User created successfully", 
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        userRole: newUser.userRole
      }
    });

  } catch (error: any) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong during signup" });
  }
};

// SIGNIN FUNCTION (Login existing user)
export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Try to generate token
    try {
      const token = generateAccessToken(existingUser);
      existingUser.accessToken = token;
      await existingUser.save();
      
      return res.status(200).json({ 
        message: "Signin successful", 
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          userRole: existingUser.userRole
        },
        token 
      });
    } catch (tokenError) {
      // Return success even if token fails
      return res.status(200).json({ 
        message: "Signin successful (without token)", 
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          userRole: existingUser.userRole
        }
      });
    }

  } catch (error: any) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Something went wrong during signin" });
  }
};

// GET ALL USERS FUNCTION
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find all users but exclude password and accessToken fields for security
    const users = await User.find({}, '-password -accessToken');
    
    return res.status(200).json({ 
      success: true,
      message: "Users retrieved successfully",
      count: users.length,
      users: users
    });

  } catch (error: any) {
    console.error("Get all users error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong while fetching users" 
    });
  }
};

// GET USER BY ID FUNCTION
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "User ID is required" 
      });
    }

    // Find user by ID, exclude password and accessToken
    const user = await User.findById(id, '-password -accessToken');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: "User retrieved successfully",
      user: user
    });

  } catch (error: any) {
    console.error("Get user by ID error:", error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID format" 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong while fetching user" 
    });
  }
};

// TEST ROUTE (for testing if GET requests work)
export const testRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({ 
      success: true,
      message: "GET request is working perfectly!",
      timestamp: new Date().toISOString(),
      route: "/user/user/test",
      method: "GET"
    });
  } catch (error: any) {
    console.error("Test route error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong in test route" 
    });
  }
};
