const express = require('express');

const router = express.Router();

const handicraftController = require('../controllers/handicraftController');

router
  .route('/')
  .get(handicraftController.getAllHandicrafts)
  .post(
    handicraftController.uploadHandicraftPhoto,
    handicraftController.createHandicraft
  );

router.route('/:id').get(handicraftController.getHandicraft).patch().delete();

module.exports = router;
