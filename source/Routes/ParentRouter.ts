import { Router } from "express";
import {container} from "../Lib/container";
import { ParentController } from "../Controller";

const router = Router();

const parentController = container.resolve(ParentController);

router.post("/parents", (req, res, next) => parentController.createParent(req, res, next));
router.post("/parents/students", (req, res, next) => parentController.createParentWithStudents(req, res, next));

export default router;