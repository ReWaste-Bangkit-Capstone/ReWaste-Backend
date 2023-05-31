const express = require('express');

const router = express.Router();

const handicraftController = require('../controllers/handicraftController');

// get by tag
router.route('/tag').get(handicraftController.getHandicraftsByTags);

router
  .route('/')
  .get(handicraftController.getAllHandicrafts)
  .post(
    handicraftController.uploadHandicraftPhoto,
    handicraftController.createHandicraft
  );

router
  .route('/:id')
  .get(handicraftController.getHandicraft)
  .patch()
  .delete(
    handicraftController.deleteAssociatedFile,
    handicraftController.deleteHandicraft
  );

module.exports = router;
