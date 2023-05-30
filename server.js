const dotenv = require('dotenv');
const sequelize = require('./utils/database');
const User = require('./models/userModel');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: './config.env',
});
const app = require('./app');

const sync = async () => await sequelize.sync({ force: true });
sync().then(() => {
  User.create({
    email: 'test@test.com',
    password: '123456',
    username: 'neo',
  });
  User.create({
    email: 'test2@test.com',
    password: '123456',
    username: 'celeb_neo',
  });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
