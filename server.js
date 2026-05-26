import 'dotenv/config';
import app from './backend/app.js';
import { initializeDatabase } from './backend/config/database.js';

const port = Number(process.env.PORT) || 5000;

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server API berjalan di http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Gagal menyalakan server:', error);
    process.exit(1);
  });
