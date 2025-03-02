import { Router } from "express";
import { TeacherController } from "../Controller";
import {container} from "../Lib/container";

const router = Router();

const teacherController = container.resolve(TeacherController);

router.post("", (req, res, next) => teacherController.createTeacher(req, res, next));

export default router;