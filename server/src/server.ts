import app from './app';
import { dbPool } from './config/db';

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    const connection = await dbPool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release(); 
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1); 
  }
};

startServer();
