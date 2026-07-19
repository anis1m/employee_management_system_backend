import express from "express";
import {
  CreateEmployee,
  deleteEmployee,
  GetAllEmployees,
  GetAllEmployeesForAssigningRoles,
  getAllReportingManagers,
  GetSingleEmployee,
  UpdateEmployee,
} from "../controller/EmployeeController";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/", upload.single("ProfileImage"), CreateEmployee);
router.get("/", GetAllEmployees);
router.get("/getallemployeesforrolesassign", GetAllEmployeesForAssigningRoles);
router.post("/:Id", GetSingleEmployee);
router.put("/", upload.single("ProfileImage"), UpdateEmployee);
router.delete("/:Id", deleteEmployee);
router.get("/reporting-managers", getAllReportingManagers);

export default router;
