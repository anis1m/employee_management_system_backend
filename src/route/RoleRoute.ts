import express from "express";
import { getAllRoles } from "../controller/RoleController";

const router = express.Router();

router.get("/", getAllRoles);

export default router;
