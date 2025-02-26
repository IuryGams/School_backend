import { Router } from "express";
import {container} from "../Lib/container";
import {AuthController} from "../Controller";

const router = Router();

const authController = container.resolve(AuthController);

router.post("/login", (req, res, next) => authController.login(req, res, next));
router.get("/user", (req, res, next) => authController.getInformationUser(req, res, next));

export default router;