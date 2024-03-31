import express from "express";
import { register } from "../controllers/register.controller";

export const registerRouter = express.Router();

registerRouter.post("/", register);
