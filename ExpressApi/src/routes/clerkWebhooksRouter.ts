import {Router} from "express";
import { onboardUser } from "../handlers/userHandler";

const router = Router();

router.post('/', onboardUser )

export default router;