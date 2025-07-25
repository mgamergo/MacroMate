import { Router } from "express";

import {getUserStats, deleteUserStats, editUserStats, postUserStats} from "../handlers/statsHandler";

const router = Router();

router.get('/', getUserStats);

router.post('/', postUserStats);

router.patch('/edit/:id', editUserStats);

router.delete('/delete/:id', deleteUserStats);

export default router;
