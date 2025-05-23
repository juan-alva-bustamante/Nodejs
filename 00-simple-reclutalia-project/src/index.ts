import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();

app.listen(8002, () => {
  console.log("http://localhost:8002");
});

module.exports = app;