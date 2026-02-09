const Nutrition = require('../models/Nutrition');
const { getDb, connectDb } = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

async function getNutritionByUserId(req, res, next) {
    try {
        if (getConnectionState()) {
            const userId = new ObjectId(req.params.userId);
            const nutritionEntries = await Nutrition.selectNutritionByUserId(getDb(), userId);
            if (nutritionEntries.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json(nutritionEntries);
            } else {
                return res.status(404).json({ error: 'No nutrition entries found for this user.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function createNutritionEntry(req, res, next) {
    try {
        const nutrition = {
            userId: new ObjectId(req.body.userId),
            mealType: req.body.mealType,
            calories: req.body.calories,
            protein: req.body.protein,
            carbs: req.body.carbs,
            fat: req.body.fat,
            date: new Date(req.body.date)
        };
        if (getConnectionState()) {
            const result = await Nutrition.insertNutrition(getDb(), nutrition);
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ message: 'Nutrition entry created successfully.', nutritionId: result._id });
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function editNutritionEntry(req, res, next) {
    try {
        const nutritionData = {};
        if (req.body.mealType) nutritionData.mealType = req.body.mealType;
        if (req.body.calories) nutritionData.calories = req.body.calories;
        if (req.body.protein) nutritionData.protein = req.body.protein;
        if (req.body.carbs) nutritionData.carbs = req.body.carbs;
        if (req.body.fat) nutritionData.fat = req.body.fat;
        if (req.body.date) nutritionData.date = new Date(req.body.date);
        if (getConnectionState()) {
            const nutritionId = new ObjectId(req.params.nutritionId);
            const updatedNutrition = await Nutrition.updateNutrition(getDb(), nutritionId, nutritionData);
            if (updatedNutrition && updatedNutrition.matchedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: 'Nutrition entry updated successfully.' });
            } else {
                return res.status(404).json({ error: 'Nutrition entry not found.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function removeNutritionEntry(req, res, next) {
    try {
        if (getConnectionState()) {
            const nutritionId = new ObjectId(req.params.nutritionId);
            const result = await Nutrition.deleteNutrition(getDb(), nutritionId);
            if (result.deletedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: 'Nutrition entry removed successfully.' });
            } else {
                return res.status(404).json({ error: 'Nutrition entry not found.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { getNutritionByUserId, createNutritionEntry, editNutritionEntry, removeNutritionEntry };