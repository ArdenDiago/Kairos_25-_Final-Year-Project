const router = require("express").Router();
const { getCoordinatorInfo, getEventParticipants, postCoordinatorResults } = require('./coordinator.controler');

router.get('/', getCoordinatorInfo);
router.get('/eventParticipants', getEventParticipants);

router.post('/', postCoordinatorResults);


module.exports = router;