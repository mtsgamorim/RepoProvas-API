import { Router } from "express";
import { createTest } from "../controllers/testsControllers";
import validateSchema from "../middlewares/schemaValidator";
import validateTokenExists from "../middlewares/validateTokenExists";
import testSchema from "../schemas/testSchema";

const router = Router();

router.post(
  "/tests",
  validateTokenExists,
  validateSchema(testSchema),
  createTest
);

export default router;
