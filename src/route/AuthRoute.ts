import express from "express";
import { AuthLogin } from "../controller/AuthController";

const router = express.Router();

router.post("/login", AuthLogin);

export default router;
