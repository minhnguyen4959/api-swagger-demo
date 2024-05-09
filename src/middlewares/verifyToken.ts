import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: "you need login"})
    }
    const secret = process.env.SECRET_JWT_KEY ? process.env.SECRET_JWT_KEY : ""
    
    jwt.verify(
        token!,
        process.env.ACCESS_TOKEN_SECRET!,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //--> invalid token
            next();
        }
    );
   
    
  } catch (error) {
    return res.status(401).json({message: "Internal server error"});
  }
}

export default verifyToken;