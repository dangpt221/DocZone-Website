
import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trustguard';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('--- TRUSTGUARD DB CONNECTED ---');
    app.listen(PORT, () => {
      console.log(`--- SECURITY GATEWAY ACTIVE ON PORT ${PORT} ---`);
    });
  })
  .catch(err => {
    console.error('DATABASE CONNECTION ERROR:', err);
    process.exit(1);
  });
