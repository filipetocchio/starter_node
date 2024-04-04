import express from "express";
import { refreshToken } from "../controllers/refreshToken.controller";

export const refreshRouter = express.Router();

refreshRouter.get("/:id", refreshToken);
