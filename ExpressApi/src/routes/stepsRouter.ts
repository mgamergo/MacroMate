import {Router} from "express";
import {getStepsData, postStepsData, editStepsData, deleteStepsData, todaysStepsData} from "../handlers/stepsHandler";

const router = Router();

router.get('/', getStepsData );

router.get('/today', todaysStepsData);

router.post('/', postStepsData);

router.patch('/edit/:id', editStepsData);

router.delete('/delete/:id', deleteStepsData);

export default router
