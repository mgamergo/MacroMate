import {Router} from "express";
import { createUserInDb } from "../handlers/clerkHandler";

const router = Router();

router.post('/', createUserInDb as any )

export default router;