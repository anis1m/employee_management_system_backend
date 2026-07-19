import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity({ name: "ReportingManagers" })
export class Manager {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ unique: true, length: 100 })
  Email!: string;

  @OneToMany(() => Employee, (employee) => employee.ReportingManager)
  Employees!: Employee[];
}
