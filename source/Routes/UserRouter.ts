import { Router } from "express";
import {UserController} from "../Controller";
import {container} from "../Lib/container";

const router = Router();

const userController = container.resolve(UserController);

router.post("", (req, res, next) => userController.createUser(req, res, next));
router.delete("/:user_id", (req, res, next) => userController.deleteUser(req, res, next));

export default router;