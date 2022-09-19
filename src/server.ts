import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT: Number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server funcionando na porta: ${PORT}`);
});
