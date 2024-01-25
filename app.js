import express from "express";
import connect from "./schemas/index.js";
import Router from "./routes/products.router.js";

connect();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", Router);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
