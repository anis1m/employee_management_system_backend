import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function AuthLogin(req: Request, res: Response) {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employee = await employeeRepo.findOne({
      where: {
        Email: req.body.Email,
      },
    });
    if (!employee) {
      return res.status(400).json({
        message: "User Not Found",
      });
    }

    const passwordresult = await bcrypt.compare(
      req.body.Password,
      employee.Password
    );
    if (passwordresult) {
      const token = jwt.sign(
        { Id: employee.Id, Email: employee.Email },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({
        message: "Logged in Successfully",
        data: token,
      });
    }
    return res.status(400).json({
      message: "Password is Wrong",
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export function AuthLogout(req: Request, res: Response) {}
