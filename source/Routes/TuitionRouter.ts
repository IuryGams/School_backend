import { Router } from "express";
import { TuitionController } from "../Controller";
import { container } from "../Lib/container";



const router = Router();

const tuitionController = container.resolve(TuitionController);

// Tuition

router.post("/parents/tuitions/:parent_id", (req, res, next) => tuitionController.createTuition(req, res, next));
router.get("/parents/tuitions", (req, res, next) => tuitionController.getAllTuitions(req, res, next));
router.get("/parents/tuitions/teste", (req, res, next) => tuitionController.getTuitionTeste(req, res, next));



export default router;