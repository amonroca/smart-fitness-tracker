const Users = require('../models/Users');
const { getDb, getConnectionState } = require('../data/database');
const ObjectId  = require('mongodb').ObjectId;

async function getUserById(req, res, next) {
    try {
        if (getConnectionState()) {
            const userId = new ObjectId(req.params.userId);
            const user = await Users.selectUserById(getDb(), userId);
            if (user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json(user);
            }
            else {
                return res.status(404).json({ error: 'User not found.' });
            }
        }
        return res.status(503).json({ error: 'Database connection not established.' });
    } catch (error) {
        next(error);
    }
}

async function createUser(req, res, next) {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender,
        height: req.body.height,
        weight: req.body.weight
    }
    try {
        if (getConnectionState()) {
            const result = await Users.insertUser(getDb(), userData);
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ message: 'User created successfully.', userId: result._id }); 
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function editUser(req, res, next) {
    const userData = {};
    if (req.body.name) userData.name = req.body.name;
    if (req.body.email) userData.email = req.body.email;
    if (req.body.age) userData.age = req.body.age;
    if (req.body.gender) userData.gender = req.body.gender;
    if (req.body.height) userData.height = req.body.height;
    if (req.body.weight) userData.weight = req.body.weight;
    try {
        if (getConnectionState()) {
            const userId = new ObjectId(req.params.userId);
            const updatedUser = await Users.updateUser(getDb(), userId, userData);
            if (updatedUser && updatedUser.matchedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: 'User updated successfully.' });
            } else {
                return res.status(404).json({ error: 'User not found.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

async function removeUser(req, res, next) {
    try{
        if (getConnectionState()) {
            const userId = new ObjectId(req.params.userId);
            const result = await Users.deleteUser(getDb(), userId);
            if (result.deletedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: 'User deleted successfully.' });
            } else {
                return res.status(404).json({ error: 'User not found.' });
            }
        } else {
            return res.status(503).json({ error: 'Database connection not established.' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { getUserById, createUser, editUser, removeUser };