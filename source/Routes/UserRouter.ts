import { Router } from "express";
import { CoordinatorController, ParentController, StudentController, TeacherController, UserController } from "../Controller";
import { container } from "../Lib/container";

const router = Router();

const userController = container.resolve(UserController);
const studentController = container.resolve(StudentController);
const parentController = container.resolve(ParentController);
const coordinatorController = container.resolve(CoordinatorController);
const teacherController = container.resolve(TeacherController);

// ----------------------------------------
// ** Users Routes **
// ----------------------------------------
router.post("/", (req, res, next) => userController.createUser(req, res, next));
router.delete("/:user_id", (req, res, next) => userController.deleteUser(req, res, next));

// ----------------------------------------
// ** Students Routes **
// ----------------------------------------
router.post("/parents/:parent_id/students", (req, res, next) => studentController.createStudent(req, res, next));

// ----------------------------------------
// ** Parents Routes **
// ----------------------------------------
router.post("/parents", (req, res, next) => parentController.createParent(req, res, next));
router.post("/parents/students", (req, res, next) => parentController.createParentWithStudents(req, res, next));

// ----------------------------------------
// ** Coordinators Routes **
// ----------------------------------------
router.post("/coordinators", (req, res, next) => coordinatorController.createCoordinator(req, res, next));
router.post("/coordinators/class/:teacher_id", (req, res, next) => coordinatorController.createCoordinator(req, res, next));
router.put("/coordinators/:coordinator_id", (req, res, next) => coordinatorController.updateCoordinator(req, res, next));
router.delete("/coordinators/:coordinator_id", (req, res, next) => coordinatorController.deleteCoordinator(req, res, next));
router.put("/coordinators/:coordinator_id", (req, res, next) => coordinatorController.deleteCoordinator(req, res, next));

// ----------------------------------------
// ** Teachers Routes **
// ----------------------------------------
router.post("/teachers", (req, res, next) => teacherController.createTeacher(req, res, next));

export default router;