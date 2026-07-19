import { AppDataSource } from "../data-source";
import { Role } from "../entity/Role";
import { Request, Response } from "express";

export async function insertRoles() {
  const roleRepository = AppDataSource.getRepository(Role);

  await roleRepository.upsert(
    [{ Name: "Super Admin" }, { Name: "HR Manager" }, { Name: "Employee" }],
    ["Name"]
  );
}

export async function getAllRoles(req: Request, res: Response) {
  try {
    const roleRepo = AppDataSource.getRepository(Role);
    const roles = await roleRepo.find();
    return res.status(200).json({
      message: "Roles Fetched Successfully",
      data: roles,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}
