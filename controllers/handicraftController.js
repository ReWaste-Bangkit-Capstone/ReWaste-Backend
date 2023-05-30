const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const catchAsync = require('../utils/catchAsync');

const Handicraft = require('../models/handicraftModel');
const handlerFactory = require('./handlerFactory');

const storage = new Storage({
  projectId: 'rewaste-220523',
  keyFilename: 'keyStorage.json',
});

const bucketName = 'rewaste-bucket-capstone';

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadHandicraftPhoto = upload.single('photo_url');

exports.createHandicraft = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const { file } = req;

  console.log(file);

  // Generate a unique filename for the uploaded file
  const filename = `${uuidv4()}${path.extname(file.originalname)}`;

  // Upload the file to Google Cloud Storage
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(filename);
  const stream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });
  stream.on('error', (err) => {
    next(err);
  });
  stream.on('finish', async () => {
    // Construct the URL for the uploaded file
    const url = `https://storage.googleapis.com/${bucketName}/${filename}`;

    // Create a new Handicraft record with the uploaded file URL
    const handicraft = await Handicraft.create({
      name,
      description,
      photo_url: url,
    });

    res.status(201).json({
      status: 'success',
      data: {
        handicraft,
      },
    });
  });
  stream.end(file.buffer);
});

exports.getAllHandicrafts = handlerFactory.getAll(Handicraft);
exports.getHandicraft = handlerFactory.getOne(Handicraft);
exports.updateHandicraft = handlerFactory.updateOne(Handicraft);
exports.deleteHandicraft = handlerFactory.deleteOne(Handicraft);
