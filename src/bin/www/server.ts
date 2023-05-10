import app from "../../app";
import config from "../../config/config";
import connectDB from "../../config/db";

void connectDB();

app.listen(config.server.port, () => {
  console.log(`⚡️[server]: Server is running at http://${config.server.host}:${config.server.port}`);
});
