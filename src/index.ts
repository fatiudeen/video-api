import app from "./app";
import { PORT, DB_URI } from "./config";
import db from "./db";

app.listen(PORT, () => {
  db(<string>DB_URI);
  console.log("server running on port", PORT);
});
