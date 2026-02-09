const Workouts = require('../models/Workouts');
const { getDb, getConnectionState } = require('../data/database');
const ObjectId  = require('mongodb').ObjectId;

async function getWorkoutsByUserId(req, res, next) {
    try {
        if (getConnectionState()) {
            const userId = new ObjectId(req.params.userId);
            const workouts = await Workouts.selectWorkoutsByUserId(getDb(), userId);
            if (workouts.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json(workouts);
            } else {
                return res.status(404).json({ error: 'No workouts found for this user.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function createWorkout(req, res, next) {
    try {
        const workout = {
            userId: new ObjectId(req.body.userId),
            date: new Date(req.body.date),
            type: req.body.type,
            duration: req.body.duration,
            caloriesBurned: req.body.caloriesBurned,
            notes: req.body.notes
        }
        if (getConnectionState()) {
            const insertedId = await Workouts.insertWorkout(getDb(), workout);
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ message: 'Workout created successfully.', workoutId: insertedId }); 
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function editWorkout(req, res, next) {
    try {
        const workoutId = new ObjectId(req.params.workoutId);
        const updatedFields = {};
        if (req.body.date) updatedFields.date = new Date(req.body.date);
        if (req.body.type) updatedFields.type = req.body.type;
        if (req.body.duration) updatedFields.duration = req.body.duration;
        if (req.body.caloriesBurned) updatedFields.caloriesBurned = req.body.caloriesBurned;
        if (req.body.notes) updatedFields.notes = req.body.notes;
        if (getConnectionState()) {
            const modifiedCount = await Workouts.updateWorkout(getDb(), workoutId, updatedFields);
            if (modifiedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: 'Workout updated successfully.' });
            }
            else {
                return res.status(404).json({ error: 'Workout not found.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function removeWorkout(req, res, next) {
    try {
        if (getConnectionState()) {
            const workoutId = new ObjectId(req.params.workoutId);
            const result = await Workouts.deleteWorkout(getDb(), workoutId);
            if (result && result.deletedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: 'Workout deleted successfully.' });
            } else {
                return res.status(404).json({ error: 'Workout not found.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { getWorkoutsByUserId, createWorkout, editWorkout, removeWorkout };