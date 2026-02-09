const router = require('express').Router();
const { getWorkoutsByUserId, createWorkout, editWorkout, removeWorkout } = require('../controllers/workoutsController');
const { createWorkoutValidation, editWorkoutValidation, idParamValidator, validateRequest } = require('../middleware/validate');

router.get('/user/:userId', /*
    #swagger.tags = ['Workouts']
    #swagger.description = 'Endpoint to retrieve all workouts for a specific user.'
    #swagger.parameters['userId'] = {
        in: 'path',
        description: 'ID of the user to retrieve workouts for',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Workouts retrieved successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            userId: { type: 'string' },
                            type: { type: 'string' },
                            duration: { type: 'number' },
                            date: { type: 'string', format: 'date-time' },
                            caloriesBurned: { type: 'number' },
                            notes: { type: 'string' }
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'No workouts found for this user.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[503] = {
        description: 'Database connection not established.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    */ ...idParamValidator('userId'), validateRequest, getWorkoutsByUserId);
router.post('/', /*
    #swagger.tags = ['Workouts']
    #swagger.description = 'Endpoint to create a new workout.'
    #swagger.parameters['workout'] = {
        in: 'body',
        description: 'Workout information',
        required: true,
        schema: {
            userId: 'User ID as string',
            type: 'Running',
            duration: 60,
            date: '2024-06-01T10:00:00Z',
            caloriesBurned: 500,
            notes: 'Morning run in the park'

        }
    }
    #swagger.responses[201] = {
        description: 'Workout created successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        workoutId: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[503] = {
        description: 'Database connection not established.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request. Invalid input data.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    */ createWorkoutValidation, validateRequest, createWorkout);
router.put('/:workoutId', /*
    #swagger.tags = ['Workouts']
    #swagger.description = 'Endpoint to update an existing workout.'
    #swagger.parameters['workoutId'] = {
        in: 'path',
        description: 'ID of the workout to update',
        required: true,
        type: 'string'
    }
    #swagger.parameters['workout'] = {
        in: 'body',
        description: 'Updated workout information',
        required: true,
        schema: {
            type: 'Running',
            duration: 50,
            date: '2024-06-01T10:00:00Z',
            caloriesBurned: 550,
            notes: 'Morning run in the park - updated'
        }
    }
    #swagger.responses[200] = {
        description: 'Workout updated successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Workout not found.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[503] = {
        description: 'Database connection not established.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request. Invalid input data.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    */ ...idParamValidator('workoutId'), editWorkoutValidation, validateRequest, editWorkout);
router.delete('/:workoutId', /*
    #swagger.tags = ['Workouts']
    #swagger.description = 'Endpoint to delete a workout.'
    #swagger.parameters['workoutId'] = {
        in: 'path',
        description: 'ID of the workout to delete',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Workout deleted successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'Workout not found.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[503] = {
        description: 'Database connection not established.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
    */ ...idParamValidator('workoutId'), validateRequest, removeWorkout);

    module.exports = router;