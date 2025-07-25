import { Router } from "express";
import {getCurrentUser, onboardUser} from "../handlers/userHandler";

const router = Router();

router.get('/', getCurrentUser);

router.post('/onboard', onboardUser);

export default router;