const router = require('express').Router();
const itManagerRouter = require('./ItManager/ItManager.router');
const admingRouter = require('./admin/admin.router');

router.use('/ITManager', itManagerRouter);
router.use('/admin', admingRouter);


module.exports = router;