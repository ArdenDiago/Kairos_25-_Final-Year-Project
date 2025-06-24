const router = require('express').Router();

const {getUserScores, postAnswers} = require('./admin.controler');

router.get('/:event', getUserScores);
router.post('/:event', postAnswers);

module.exports = router;