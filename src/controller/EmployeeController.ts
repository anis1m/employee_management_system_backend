import { Request, Response } from "express";
import { EmailValidation, PasswordValidation } from "../utils/Validations";
import { Employee } from "../entity/Employee";
import { AppDataSource } from "../data-source";
import { Department } from "../entity/Department";
import { Role } from "../entity/Role";
import { Manager } from "../entity/Manager";
import bcrypt from "bcrypt";
import { Not } from "typeorm";

export async function CreateEmployee(req: Request, res: Response) {
  try {
    const employee = req.body;
    if (
      employee.Email &&
      employee.Salary &&
      employee.Phone &&
      employee.Password
    ) {
      if (
        EmailValidation(employee.Email) &&
        PasswordValidation(employee.Password)
      ) {
        if (employee["Department.Name"]) {
          const departmentRepo = AppDataSource.getRepository(Department);
          const department = await departmentRepo.findOne({
            where: [
              {
                Id: employee["Department.Id"],
              },
              {
                Name: employee["Department.Name"],
              },
            ],
          });

          if (department) {
            employee.Department = department;
          } else {
            const department = new Department();
            department.Name = employee["Department.Name"];
            const savedDepartment = await departmentRepo.save(department);
            employee.Department = savedDepartment;
          }
        }

        if (employee["Role.Id"]) {
          const roleRepo = AppDataSource.getRepository(Role);
          const role = await roleRepo.findOne({
            where: {
              Id: employee["Role.Id"],
            },
          });
          if (role) {
            employee.Role = role;
          } else {
            const role = await roleRepo.findOne({
              where: {
                Name: "Employee",
              },
            });
            if (role) {
              employee.Role = role;
            }
          }
        } else {
          const roleRepo = AppDataSource.getRepository(Role);
          const role = await roleRepo.findOne({
            where: {
              Name: "Employee",
            },
          });
          if (role) {
            employee.Role = role;
          }
        }

        if (employee["ReportingManager.Id"]) {
          const managerRepo = AppDataSource.getRepository(Manager);
          const manager = await managerRepo.findOne({
            where: {
              Id: Number(employee["ReportingManager.Id"]),
            },
          });
          if (manager) {
            employee.ReportingManager = manager;
          }
        }

        const employeeRepo = AppDataSource.getRepository(Employee);
        employee.Password = await bcrypt.hash(employee.Password, 14);
        if (req.file) {
          employee.ProfileImage = req.file.filename;
        }

        await employeeRepo.save(employee);
        return res.status(200).json({
          message: "Employee Created Successfully",
        });
      }
      return res.status(400).json({
        message: "Either Email and Password are Not in Valid Format",
      });
    }

    return res.status(400).json({
      message: "Required fields are missing",
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export async function GetSingleEmployee(req: Request, res: Response) {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employee = await employeeRepo.findOne({
      where: [
        {
          Id: Number(req.params.Id ?? 0),
        },
        { EmployeeId: req.body.EmployeeId },
        { Email: req.body.Email },
      ],
      relations: {
        ReportingManager: true,
        Department: true,
        Role: true,
      },
    });
    if (employee) {
      return res.status(200).json({
        message: "Employee Fetched Successfully",
        data: employee,
      });
    }
    return res.status(400).json({
      message: "Employee Not Found",
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export async function GetAllEmployees(req: Request, res: Response) {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employees = await employeeRepo.find({
      where: {
        Role: {
          Name: Not("Super Admin"),
        },
      },
      relations: {
        Department: true,
        Role: true,
        ReportingManager: true,
      },
    });
    return res.status(200).json({
      message: "Employees Fetched Successfully",
      data: employees,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export async function GetAllEmployeesForAssigningRoles(
  req: Request,
  res: Response
) {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employees = await employeeRepo.find({
      relations: {
        Department: true,
        Role: true,
        ReportingManager: true,
      },
    });
    return res.status(200).json({
      message: "Employees Fetched Successfully",
      data: employees,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export async function UpdateEmployee(req: Request, res: Response) {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employee = req.body;
    const fetchedEmployee = await employeeRepo.findOne({
      where: [
        {
          Id: employee.Id,
        },
        { EmployeeId: employee.EmployeeId },
        { Email: employee.Email },
      ],
      relations: {
        ReportingManager: true,
        Department: true,
        Role: true,
      },
    });

    if (fetchedEmployee) {
      fetchedEmployee.EmployeeId =
        employee.EmployeeId ?? fetchedEmployee.EmployeeId;
      fetchedEmployee.Name = employee.Name ?? fetchedEmployee.Name;
      fetchedEmployee.Email = employee.Email ?? fetchedEmployee.Email;
      fetchedEmployee.Phone = employee.Phone ?? fetchedEmployee.Phone;
      fetchedEmployee.Designation =
        employee.Designation ?? fetchedEmployee.Designation;
      fetchedEmployee.Salary = employee.Salary ?? fetchedEmployee.Salary;
      fetchedEmployee.JoiningDate =
        employee.JoiningDate ?? fetchedEmployee.JoiningDate;
      fetchedEmployee.Status = employee.Status ?? fetchedEmployee.Status;
      fetchedEmployee.ProfileImage =
        employee.ProfileImage ?? fetchedEmployee.ProfileImage;
      fetchedEmployee.Password = employee.Password ?? fetchedEmployee.Password;
    }

    if (employee["Department.Name"]) {
      const departmentRepo = AppDataSource.getRepository(Department);
      const department = await departmentRepo.findOne({
        where: [
          { Id: employee["Department.Id"] },
          { Name: employee["Department.Name"] },
        ],
      });
      if (department && fetchedEmployee) {
        fetchedEmployee.Department = department;
      } else if (fetchedEmployee) {
        const department = new Department();
        department.Name = employee["Department.Name"];
        const savedDepartment = await departmentRepo.save(department);
        fetchedEmployee.Department = savedDepartment;
      }
    }

    if (employee["Role.Id"]) {
      const roleRepo = AppDataSource.getRepository(Role);
      const role = await roleRepo.findOne({
        where: [{ Id: employee["Role.Id"] }, { Name: employee["Role.Name"] }],
      });
      if (role && fetchedEmployee) {
        const managerRepo = AppDataSource.getRepository(Manager);
        const manager = await managerRepo.findOne({
          where: {
            Id: Number(employee["ReportingManager.Id"] ?? "0"),
          },
        });

        if (role.Name == "HR Manager") {
          if (!manager) {
            await managerRepo.save({
              Email: fetchedEmployee.Email,
            });
          }
        } else {
          if (fetchedEmployee.ReportingManager) {
            await managerRepo.delete(fetchedEmployee.ReportingManager.Id);
          }
        }
        fetchedEmployee.Role = role;
      }
    } else {
      const roleRepo = AppDataSource.getRepository(Role);
      const role = await roleRepo.findOne({
        where: {
          Name: "Employee",
        },
      });
      if (role) {
        employee.Role = role;
      }
    }

    if (employee["ReportingManager.Id"]) {
      const managerRepo = AppDataSource.getRepository(Manager);
      const manager = await managerRepo.findOne({
        where: {
          Id: Number(employee["ReportingManager.Id"]),
        },
      });
      if (manager && fetchedEmployee) {
        fetchedEmployee.ReportingManager = manager;
      }
    }

    if (fetchedEmployee) {
      await employeeRepo.save(fetchedEmployee);
      return res.status(200).json({
        message: "Employee Updated Successfully",
      });
    }

    return res.status(400).json({
      message: "Employee Not Found",
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export async function deleteEmployee(req: Request, res: Response) {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employee = await employeeRepo.findOne({
      where: {
        Id: Number(req.params.Id ?? 0),
      },
    });
    if (employee) {
      const managerRepo = AppDataSource.getRepository(Manager);
      const manager = await managerRepo.findOne({
        where: {
          Email: employee.Email,
        },
      });
      if (manager) {
        await managerRepo.delete(manager.Id);
      }
      await employeeRepo.delete(req.params.id);
      return res.status(200).json({
        message: "Employee Deleted Successfully",
      });
    }

    return res.status(400).json({
      message: "Employee Not Found",
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export async function getAllReportingManagers(req: Request, res: Response) {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employees = await employeeRepo.find({
      where: {
        Role: {
          Name: "HR Manager",
        },
      },
      relations: {
        Role: true,
      },
    });
    return res.status(200).json({
      message: "Reporting Managers Fetched Successfully",
      data: employees,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}
