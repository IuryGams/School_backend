import { Router } from "express";
import UserRouter from "./UserRouter";
import AuthRouter from "./AuthRouter";
import ParentRouter from "./ParentRouter";
import StudentRouter from "./StudentRouter";
import { errorHandler } from "../Middlewares/error";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/users", ParentRouter);
router.use("/users", StudentRouter);

router.use(errorHandler);


export default router;