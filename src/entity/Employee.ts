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

  @Column({ unique: true, length: 20 })
  EmployeeId!: string;

  @Column({ length: 100 })
  Name!: string;

  @Column({ unique: true, length: 100 })
  Email!: string;

  @Column({ length: 15 })
  Phone!: string;

  @ManyToOne(() => Department, (department) => department.Employees)
  Department!: number;

  @Column({ length: 100 })
  Designation!: string;

  @Column("decimal", {
    precision: 10,
    scale: 2,
  })
  Salary!: number;

  @Column({
    type: "date",
  })
  JoiningDate!: Date;

  @Column({
    type: "enum",
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  Status!: EmployeeStatus;

  @ManyToOne(() => Role)
  Role!: number;

  @ManyToOne(() => Manager, (manager) => manager.Employees)
  ReportingManager!: number;

  @Column({
    nullable: true,
    length: 255,
  })
  ProfileImage!: string;
}
