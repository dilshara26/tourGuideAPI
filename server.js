// START SERVER
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

// mongoose is intellgent to understnad that tours is the plural of Tour

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTIONS🔥 SERVER SHUTTING DOWN...');
  server.close(() => {
    process.exit(1);
  });
});
