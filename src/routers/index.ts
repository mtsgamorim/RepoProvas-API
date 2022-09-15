import { Router } from "express";

import usersRouter from "./usersRouter";
import testsRouter from "./testsRouter";

const routes = Router();

routes.use(usersRouter);
routes.use(testsRouter);

export default routes;
