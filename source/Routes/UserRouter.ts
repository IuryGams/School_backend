import { Router } from "express";
import {ParentController, StudentController, TeacherController, UserController} from "../Controller";
import {container} from "../Lib/container";

const router = Router();

const userController = container.resolve(UserController);
const studentController = container.resolve(StudentController);
const parentController = container.resolve(ParentController);
const teacherController = container.resolve(TeacherController);


// Users
router.post("", (req, res, next) => userController.createUser(req, res, next));
router.delete("/:user_id", (req, res, next) => userController.deleteUser(req, res, next));


// Students
router.post("/:parent_id", (req, res, next) => studentController.createStudent(req, res, next));


// Parents
router.post("/parents", (req, res, next) => parentController.createParent(req, res, next));
router.post("/parents/students", (req, res, next) => parentController.createParentWithStudents(req, res, next));

// Teachers
router.post("", (req, res, next) => teacherController.createTeacher(req, res, next));


export default router;