import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import EmployeeRoutes from "./route/EmployeeRoute";
import AuthRoutes from "./route/AuthRoute";
import RoleRoutes from "./route/RoleRoute";
import { config } from "dotenv";
import cors from "cors";
import { insertRoles } from "./controller/RoleController";
import authenticateToken from "./middleware/JwtMiddleware";
import path from "path";
config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/api/employee", EmployeeRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/roles", RoleRoutes);
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");
    await insertRoles();
    app.listen(4000, () => {
      console.log("Server running on http://localhost:4000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
