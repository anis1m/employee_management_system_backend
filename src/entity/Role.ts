import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity({ name: "Roles" })
export class Role {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ unique: true, length: 100 })
  Name!: string;

  @OneToMany(() => Employee, (employee) => employee.Role)
  Employees!: Employee[];
}
