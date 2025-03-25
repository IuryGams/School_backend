import { Router } from "express";
import UserRouter from "./UserRouter";
import AuthRouter from "./AuthRouter";
import TuitionRouter from "./TuitionRouter";
import { errorHandler } from "../Middlewares/error";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/users", TuitionRouter);

router.use(errorHandler);


export default router;