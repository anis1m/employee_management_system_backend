import "reflect-metadata";
import { DataSource } from "typeorm";
import { Employee } from "./entity/Employee";
import { Manager } from "./entity/Manager";
import { Role } from "./entity/Role";
import { Department } from "./entity/Department";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "employeemanagement",
  synchronize: true,
  logging: false,
  entities: [Employee, Manager, Role, Department],
  migrations: [],
  subscribers: [],
});
