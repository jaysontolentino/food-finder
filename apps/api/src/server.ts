import app from "./app";
import { env } from "./config/env";

app.listen(env.apiPort, () => {
  console.log(`API server running on http://localhost:${env.apiPort}`);
});
