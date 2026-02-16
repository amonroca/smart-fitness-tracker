const router = require('express').Router();
const workoutsRouter = require('./workouts');
const goalsRouter = require('./goals');
const usersRouter = require('./users');
const nutritionRouter = require('./nutrition');
const authenticationRouter = require('./authentication');

router.use('/workouts', workoutsRouter);
router.use('/goals', goalsRouter);
router.use('/users', usersRouter);
router.use('/nutrition', nutritionRouter);
router.use('/auth', authenticationRouter);

module.exports = router;