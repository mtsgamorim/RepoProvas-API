import { Router } from "express";

import usersRouter from "./usersRouter";

const routes = Router();

routes.use(usersRouter);

export default routes;
