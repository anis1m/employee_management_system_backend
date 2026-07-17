import "reflect-metadata";
import { DataSource } from "typeorm";
import { Employee } from "./entity/Employee";
import { Manager } from "./entity/Manager";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5463,
  username: "root",
  password: "password",
  database: "testdb",
  synchronize: true,
  logging: false,
  entities: [Employee, Manager],
  migrations: [],
  subscribers: [],
});
