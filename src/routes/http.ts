import * as fs from "fs";
import secret from "../config";
// import * as mysql from "mysql2";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { createHash } from "crypto";
// import Logger from "../loaders/logger";
// import { Message } from "../utils/enums";
// import getFormatDate from "../utils/date";
// import { connection } from "../utils/mysql";
import mongoose from "mongoose";
import utils from "@pureadmin/utils"
import {Request, Response} from "express";
import {UserModel} from './../models/user';
import {IUser} from '../Types/Iuser';
import HttpStatusCode from "../exceptions/HttpStatusCode";
import { signAccessToken, signRefreshToken} from "../helpers/jwt.helper"

/** 保存验证码 */
let generateVerify: number;

let expiresIn = 60000;

/**
 * @typedef Error
 * @property {string} code.required
 */

/**
 * @typedef Response
 * @property {[integer]} code
 */

// /**
//  * @typedef Login
//  * @property {string} username.required - 用户名 - eg: admin
//  * @property {string} password.required - 密码 - eg: admin123
//  * @property {integer} verify.required - 验证码
//  */

/**
 * @typedef Login
 * @property {string} username.required - 用户名 - eg: minh
 * @property {string} password.required - 密码 - eg: 123
 */

/**
 * @route POST /login
 * @param {Login.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 登录
 * @group 用户登录、注册相关
 * @returns {Response.model} 200
 * @returns {Array.<Login>} Login
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    let data = null;
    try {
        const userExisting = await UserModel.findOne({username});
        if (!userExisting) {
            const error = { message: "Invalid username or password", status: 401 };
            throw error;
        }
        const isMatchPassword = await bcrypt.compare(password, userExisting.password);


        if (!isMatchPassword) {
            const error = { message: "Invalid username or password", status: 401 };
            throw error;
        }

        const accessToken = signAccessToken(userExisting._id.toString());
        const refreshToken = signRefreshToken(userExisting._id.toString());

        res.status(200).json({
            _id: userExisting._id,
            username: userExisting.username,
            accessToken,
            refreshToken,
        })

    } catch (error: any) {
        const status = (error as any).status || 500;
        res.status(status).json({ error: error.message || "Internal Server Error" });
    }
}





// /**
//  * @typedef Register
//  * @property {string} username.required - 用户名 - eg: minh
//  * @property {string} password.required - 密码 -eg: 123
//  * @property {integer} verify.required - 验证码
//  */
/**
 * @typedef Register
 * @property {string} username.required - 用户名 - eg: minh
 * @property {string} password.required - 密码 - eg: 123
 */

/**
 * @route POST /register
 * @param {Register.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 注册
 * @group 用户登录、注册相关
 * @returns {Response.model} 200
 * @returns {Array.<Register>} Register
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        //duplicate
        const userExisting = await UserModel.findOne({ username }).exec();
        if (userExisting) {
            const error = { message: "Duplicated user !", status: 400 };
            throw error;
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await UserModel.create({
            username, password: hashedPassword
        })
        res.status(201).json(newUser);
    } catch (error: any) {
        const status = (error as any).status || 500;
        res.status(status).json({ error: error.message || "Internal Server Error" });
    }
};


/**
 * @typedef UpdateUser
 * @property {string} username.required - 用户名 - eg: data update
 */

/**
 * @route PATCH /users/{id}
 * @summary 列表更新
 * @param {UpdateUser.model} point.body.required - 用户名
 * @param {UpdateUser.model} id.path.required - 用户id
 * @group 用户管理相关
 * @returns {object} 200
 * @returns {Array.<UpdateUser>} UpdateUser
 * @security JWT
 */

const update = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {username} = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "NOT FOUND" });
    }
    try {
        const docs = await UserModel.findByIdAndUpdate({_id: id}, {username}, { new: true })
    if (!docs) {
       return res.status(404).json({message: "User not found"})
    }
    return res.status(200).json({data: docs});

  } catch (error: any) {
    const status = (error as any).status || 500;
    return res.status(status).json({ error: error.message || "Internal Server Error" });
  }
};
  
/**
 * @typedef DeleteUser
 * @property {integer} id.required - 当前id
 */

/**
 * @route DELETE /users/{id}
 * @summary 列表删除
 * @param {DeleteUser.model} id.path.required - 用户id
 * @group 用户管理相关
 * @returns {object} 200
 * @returns {Array.<DeleteUser>} DeleteUser
 * @security JWT
 */

 const remove = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "NOT FOUND" });
    }

    const docs = await UserModel.findByIdAndDelete(id);
    if(!docs) return res.status(404).json({message: "User not found"})
    return res.status(200).json({
        message: "DELETE OK",
        data: docs
    });

    } catch (error: any) {
      const status = (error as any).status || 500;
      return res.status(status).json({ error: error.message || "Internal Server Error" });
    }
  };


export {
  login,
  register,
  update,
  remove,
};
