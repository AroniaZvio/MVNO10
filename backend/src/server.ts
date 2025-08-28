import { app } from "./app";
import { config } from "./lib/config";

app.listen(config.PORT, () => {
  console.log(`🚀 Backend running in ${config.NODE_ENV} mode`);
  console.log(`📍 Server: http://localhost:${config.PORT}`);
  console.log(`🗄️  Database: ${config.DATABASE_URL.split('@')[1] || 'localhost'}`);
});