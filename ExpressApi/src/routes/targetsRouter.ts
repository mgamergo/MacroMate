import {Router} from "express";

import {getUserTargets, postUserTargets, editUserTargets, deleteUserTargets} from "../handlers/targetsHandler";

const router = Router();

router.get('/', getUserTargets);

router.post('/', postUserTargets);

router.patch('/edit/:id', editUserTargets);

router.delete('/delete/:id', deleteUserTargets);

export default router