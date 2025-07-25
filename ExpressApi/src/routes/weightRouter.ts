import {Router} from "express";
import {getWeights, postWeight, editWeight, deleteWeight} from "../handlers/weightHandler";

const router = Router();

router.get('/', getWeights);

router.post('/', postWeight);

router.patch('/edit/:id', editWeight);

router.delete('/delete/:id', deleteWeight);

export default router