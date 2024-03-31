import express from "express";
import { logout } from "../controllers/logout.controller";

export const logoutRouter = express.Router();

logoutRouter.get("/", logout);
