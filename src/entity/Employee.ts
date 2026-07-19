import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Manager } from "./Manager";
import { Role } from "./Role";
import { Department } from "./Department";

enum EmployeeStatus {
  ACTIVE,
  INACTIVE,
}

@Entity({ name: "Employees" })
export class Employee {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ unique: true, length: 20, nullable: true })
  EmployeeId!: string;

  @Column({ length: 100, nullable: true })
  Name!: string;

  @Column({ unique: true, length: 100 })
  Email!: string;

  @Column({ length: 15 })
  Phone!: string;

  @ManyToOne(() => Department, (department) => department.Employees, {
    nullable: true,
  })
  Department!: Department;

  @Column({ length: 100, nullable: true })
  Designation!: string;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    nullable: true,
  })
  Salary!: number;

  @Column({
    type: "date",
    nullable: true,
  })
  JoiningDate!: Date;

  @Column({
    type: "enum",
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
    nullable: true,
  })
  Status!: EmployeeStatus;

  @ManyToOne(() => Role)
  Role!: Role;

  @ManyToOne(() => Manager, (manager) => manager.Employees, {
    nullable: true,
    onDelete: "SET NULL",
  })
  ReportingManager!: Manager;

  @Column({
    nullable: true,
    length: 255,
  })
  ProfileImage!: string;

  @Column({ length: 100 })
  Password!: string;
}
