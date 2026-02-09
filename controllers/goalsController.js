const Goals = require('../models/Goals');
const { getDb, getConnectionState } = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

async function getGoalsByUserId(req, res, next) {
    try {
        if (getConnectionState()) {
            const userId = new ObjectId(req.params.userId);
            const goals = await Goals.selectGoalsByUserId(getDb(), userId);
            if (goals.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json(goals);
            } else {
                return res.status(404).json({ error: 'No goals found for this user.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function createGoal(req, res, next) {
    try {
        const goalData = {
            userId: new ObjectId(req.body.userId),
            goalType: req.body.goalType,
            targetValue: req.body.targetValue,
            currentValue: req.body.currentValue,
            deadline: new Date(req.body.deadline),
            status: req.body.status
        };
        if (getConnectionState()) {
            const result = await Goals.insertGoal(getDb(), goalData);
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ message: 'Goal created successfully.', goalId: result._id });
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function editGoal(req, res, next) {
    try {
        const goalData = {};
        if (req.body.targetValue !== undefined) goalData.targetValue = req.body.targetValue;
        if (req.body.currentValue !== undefined) goalData.currentValue = req.body.currentValue;
        if (req.body.deadline !== undefined) goalData.deadline = new Date(req.body.deadline);
        if (req.body.status !== undefined) goalData.status = req.body.status;
        if (getConnectionState()) {
            const goalId = new ObjectId(req.params.goalId);
            const modifiedCount = await Goals.updateGoal(getDb(), goalId, goalData);
            if (modifiedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: 'Goal updated successfully.' });
            } else {
                return res.status(404).json({ error: 'Goal not found.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function removeGoal(req, res, next) {
    try {
        if (getConnectionState()) {
            const goalId = new ObjectId(req.params.goalId);
            const result = await Goals.deleteGoal(getDb(), goalId);
            if (result.deletedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: 'Goal removed successfully.' });
            } else {
                return res.status(404).json({ error: 'Goal not found.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { getGoalsByUserId, createGoal, editGoal, removeGoal };