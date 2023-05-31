const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

const User = require('./models/userModel');
const userRouter = require('./routes/userRoutes');
const handicraftRouter = require('./routes/handicraftRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');

const app = express();
// global middleware

// set security http headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});

// limit requests from same API
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json());

// data sanitization against XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/handicrafts', handicraftRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
const sequelize = require('./utils/database');
const Handicraft = require('./models/handicraftModel');

const sync = async () => await sequelize.sync({ force: true });
sync().then(() => {
  User.create({
    email: 'test@test.com',
    password: '123456',
    name: 'neo ges',
  });
  User.create({
    email: 'test2@test.com',
    password: '123456',
    name: 'celeb_neo',
  });
  Handicraft.create({
    name: 'Celengan Botol Plastik',
    description:
      'Celengan dari botol bekas air mineral adalah salah satu contoh kerajinan dari botol plastik yang paling populer karena mudah dibuat. Anda bisa mengajak si kecil selama prosesnya agar lebih seru.',
    photo_url:
      'https://storage.googleapis.com/rewaste-bucket-capstone/imgdummy.jpg',
    steps: [
      'Siapkan botol plastik bekas ukuran bebas.',
      'Buat lubang koin kira-kira 3 cm di bagian tengah botol. Lubang ini berfungsi sebagai tempat memasukkan koin ataupun uang kertas.',
      'Cat botol sesuai kreasi.',
      'Hias botol hingga menjadi celengan lucu. Anda bisa membuatnya menjadi hewan dengan menambahkan gambar hidung di bagian tutup botol, mata, telinga, kaki dan buntut di bagian belakang.',
      'Celengan dari botol bekas air mineral pun siap dipakai.',
    ],
    tags: ['plastic', 'bottle', 'paper'],
  });
});

app.use(globalErrorHandler);

module.exports = app;
