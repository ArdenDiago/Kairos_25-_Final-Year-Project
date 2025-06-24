const router = require('express').Router();

const {getQuestions, postAnswers} = require('./ItManager.controler');

router.get('/:event', getQuestions);
router.post('/:event', postAnswers);

module.exports = router;