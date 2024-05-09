import * as dotenv from "dotenv";
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import * as swaggerJSDoc from 'swagger-jsdoc'; 
import express from 'express';


const app = express();

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}


export default {
    port: process.env.PORT ?? 9999,
    databaseURL: process.env.MONGODB_URI,
    // jwtSecret: process.env.JWT_SECRET,
    // jwtAlgorithm: process.env.JWT_ALGO,
    options: {
        swaggerDefinition: {
            info: {
                description: "This is sample CRUD for test API",
                title: "Swagger",
                version: require("../../package.json").version,
            },
            host: `localhost:${process.env.PORT ?? 9999}`,
            basePath: "/",
            produces: ["application/json", "application/xml"],
            schemes: ["http", "https"],
            securityDefinitions: {
                JWT: {
                  type: "apiKey",
                //   type: "http",
                  in: "header",
                    // scheme: "bearer",
                  name: "Authorization",
                  description: "Bearer Authorization",
                },
            },
            
        },
        route: {
            url: "./swagger-ui.html",
            // swagger文件 api
            docs: "/swagger.json",
        },
        basedir: __dirname,
        // path to the API handle folder
        files: ["../routes/*.ts"],
    },
    mongodb: {},
    api: {
        prefix: "/api",
    }
}