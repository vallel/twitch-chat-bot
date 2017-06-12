var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var rankingController = require('../app/controllers/ranking.js');

router.get('/', rankingController.rankingList);
router.get('/importar', rankingController.import);
router.post('/importar', upload.single('csvFile'), rankingController.importCsv);

module.exports = router;
