import { Router } from "express";
import { createUser, login } from "../controllers/usersControllers";
import validateSchema from "../middlewares/schemaValidator";
import userSchema from "../schemas/userSchema";

const router = Router();

router.post("/sign-up", validateSchema(userSchema), createUser);
router.post("/sign-in", validateSchema(userSchema), login);

export default router;
