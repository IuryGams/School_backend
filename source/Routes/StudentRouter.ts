import { Router } from "express";
import { StudentController } from "../Controller";
import {container} from "../Lib/container";

const router = Router();

const studentController = container.resolve(StudentController);

router.post("/students/:parent_id", (req, res, next) => studentController.createStudent(req, res, next));

export default router;