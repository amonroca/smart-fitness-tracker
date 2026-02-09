const router = require('express').Router();
const { getGoalsByUserId, createGoal, editGoal, removeGoal } = require('../controllers/goalsController');
const { createGoalValidation, editGoalValidation, idParamValidator, validateRequest } = require('../middleware/validate');

router.get('/user/:userId', /*
    #swagger.tags = ['Goals']
    #swagger.description = 'Endpoint to retrieve all goals for a specific user.'
    #swagger.parameters['userId'] = {
        in: 'path',
        description: 'ID of the user to retrieve goals for',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Goals retrieved successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            userId: { type: 'string' },
                            goalType: { type: 'string' },
                            targetValue: { type: 'number' },
                            currentValue: { type: 'number' },
                            deadline: { type: 'string', format: 'date-time' },
                            status: { type: 'string' }
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'No goals found for this user.',
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
    */ ...idParamValidator('userId'), validateRequest, getGoalsByUserId);
router.post('/', /*
    #swagger.tags = ['Goals']
    #swagger.description = 'Endpoint to create a new goal.'
    #swagger.parameters['goal'] = {
        in: 'body',
        description: 'Goal information',
        required: true,
        schema: {
            userId: 'User ID as string',
            goalType: 'Weight Loss',
            targetValue: 10,
            currentValue: 2,
            deadline: '2024-12-31T23:59:59Z',
            status: 'In Progress'
        }
    }
    #swagger.responses[201] = {
        description: 'Goal created successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        goalId: { type: 'string' }
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
    */ createGoalValidation, validateRequest, createGoal);
router.put('/:goalId', /*
    #swagger.tags = ['Goals']
    #swagger.description = 'Endpoint to update an existing goal.'
    #swagger.parameters['goalId'] = {
        in: 'path',
        description: 'ID of the goal to update',
        required: true,
        type: 'string'
    }
    #swagger.parameters['goal'] = {
        in: 'body',
        description: 'Updated goal information',
        required: true,
        schema: {
                targetValue: 15,
                currentValue: 5,
                deadline: '2024-12-31T23:59:59Z',
                status: 'Completed'
        }
    }
    #swagger.responses[200] = {
        description: 'Goal updated successfully.',
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
    #swagger.responses[404] = {
        description: 'Goal not found.',
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
    */ ...idParamValidator('goalId'), editGoalValidation, validateRequest, editGoal);
router.delete('/:goalId', /*
    #swagger.tags = ['Goals']
    #swagger.description = 'Endpoint to delete a goal.'
    #swagger.parameters['goalId'] = {
        in: 'path',
        description: 'ID of the goal to delete',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Goal deleted successfully.',
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
        description: 'Goal not found.',
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
    */ ...idParamValidator('goalId'), validateRequest, removeGoal);

module.exports = router;