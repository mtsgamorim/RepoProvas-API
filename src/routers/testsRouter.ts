import { Router } from "express";
import {
  createTest,
  getAllTestsGroupedDiscipline,
  getAllTestsGroupedTeacher,
} from "../controllers/testsControllers";
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

router.get(
  "/tests/discipline",
  validateTokenExists,
  getAllTestsGroupedDiscipline
);

router.get("/tests/teacher", validateTokenExists, getAllTestsGroupedTeacher);

export default router;
