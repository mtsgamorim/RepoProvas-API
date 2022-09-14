import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import routes from "./routers/index";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware";

const app = express();

app.use(cors());
app.use(json());

app.use(routes);
app.use(errorHandlingMiddleware);

export default app;
