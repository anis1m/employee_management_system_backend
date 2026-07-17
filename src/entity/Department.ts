import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity({ name: "Departments" })
export class Department {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ unique: true, length: 100 })
  Name!: string;

  @OneToMany(() => Employee, (employee) => employee.Department)
  Employees!: Employee[];
}
