import { Router } from "express";
import UserRouter from "./UserRouter";
import AuthRouter from "./AuthRouter";
import ParentRouter from "./ParentRouter";
import StudentRouter from "./StudentRouter";
import TeacherRouter from "./TeacherRouter";
import { errorHandler } from "../Middlewares/error";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/users/teachers", TeacherRouter);
router.use("/users/parents", ParentRouter);
router.use("/users/students", StudentRouter);

router.use(errorHandler);


export default router;