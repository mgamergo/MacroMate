import { Router } from "express";
import {getTodaysMacros, postMeal, editMeal, deleteMeal, getAllMacros} from "../handlers/macrosHandler";

const router = Router();

// GET Today's Calories
router.get('/', getTodaysMacros);

router.get('/all', getAllMacros);

router.post('/', postMeal);

router.patch('/edit/:id', editMeal);

router.delete('/delete/:id', deleteMeal);

export default router;