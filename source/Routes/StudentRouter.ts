import { Router } from "express";
import { StudentController } from "../Controller";
import {container} from "../Lib/container";

const router = Router();

const studentController = container.resolve(StudentController);

router.post("/:parent_id", (req, res, next) => studentController.createStudent(req, res, next));
router.delete("/:student_id", (req, res, next) => studentController.deleteStudent(req, res, next));

export default router;