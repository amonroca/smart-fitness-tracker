const router = require('express').Router();
const { getNutritionByUserId, createNutritionEntry, editNutritionEntry, removeNutritionEntry } = require('../controllers/nutritionController');
const { createNutritionEntryValidation, editNutritionEntryValidation, idParamValidator, validateRequest } = require('../middleware/validate');

router.get('/user/:userId', /*
    #swagger.tags = ['Nutrition']
    #swagger.description = 'Endpoint to retrieve all nutrition entries for a specific user.'
    #swagger.parameters['userId'] = {
        in: 'path',
        description: 'ID of the user to retrieve nutrition entries for',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Nutrition entries retrieved successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            userId: { type: 'string' },
                            mealType: { type: 'string' },
                            foodItems: { type: 'array', items: { type: 'string' } },
                            calories: { type: 'number' },
                            protein: { type: 'number' },
                            carbs: { type: 'number' },
                            fat: { type: 'number' },
                            date: { type: 'string', format: 'date-time' }
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'No nutrition entries found for this user.',
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
    */ ...idParamValidator('userId'), validateRequest, getNutritionByUserId);
router.post('/', /*
    #swagger.tags = ['Nutrition']
    #swagger.description = 'Endpoint to create a new nutrition entry.'
    #swagger.parameters['nutrition'] = {
        in: 'body',
        description: 'Nutrition entry information',
        required: true,
        schema: {
            userId: 'User ID as string',
            mealType: 'Breakfast',
            foodItems: ['Eggs', 'Toast'],
            calories: 350,
            protein: 20,
            carbs: 30,
            fat: 10,
            date: '2024-12-31T23:59:59Z'
        }
    }
    #swagger.responses[201] = {
        description: 'Nutrition entry created successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        nutritionId: { type: 'string' }
                    }
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Invalid request data.',
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
    */ createNutritionEntryValidation, validateRequest, createNutritionEntry);
router.put('/:nutritionId', /*
    #swagger.tags = ['Nutrition']
    #swagger.description = 'Endpoint to update an existing nutrition entry.'
    #swagger.parameters['Nutrition'] = {
        in: 'body',
        description: 'Updated nutrition entry information',
        required: true,
        schema: {
                mealType: 'Breakfast - Updated',
                foodItems: ['Eggs', 'Toast', 'Avocado'],
                calories: 450,
                protein: 20,
                carbs: 30,
                fat: 20,
                date: '2024-12-31T23:59:59Z'
        }
    }
    #swagger.responses[200] = {
        description: 'Nutrition entry updated successfully.',
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
        description: 'Invalid request data.',
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
        description: 'Nutrition entry not found.',
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
    */ ...idParamValidator('nutritionId'), editNutritionEntryValidation, validateRequest, editNutritionEntry);
router.delete('/:nutritionId', /*
    #swagger.tags = ['Nutrition']
    #swagger.description = 'Endpoint to delete a nutrition entry.'
    #swagger.parameters['nutritionId'] = {
        in: 'path',
        description: 'ID of the nutrition entry to delete',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Nutrition entry deleted successfully.',
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
        description: 'Nutrition entry not found.',
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
    */ ...idParamValidator('nutritionId'), validateRequest, removeNutritionEntry);

module.exports = router;