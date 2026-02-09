const router = require('express').Router();
const workoutsRouter = require('./workouts');
const goalsRouter = require('./goals');
const usersRouter = require('./users');
const nutritionRouter = require('./nutrition');

router.use('/workouts', workoutsRouter);
router.use('/goals', goalsRouter);
router.use('/users', usersRouter);
router.use('/nutrition', nutritionRouter);

module.exports = router;