const express = require('express');
const router = express.Router();
const DashboardController = require('../controller/DashboardController');
const CatalogueController = require('../controller/CatalogueController');
const ExcelController = require('../controller/ExcelController');

router.post('/business', DashboardController.business);
router.post('/getGeometry', DashboardController.getGeometry);

router.post('/getCategory', CatalogueController.getCategory);

router.post('/getAnswer', ExcelController.getAnswer);

module.exports = router;