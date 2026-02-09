const router = require('express').Router();
const { getUserById, createUser, editUser, removeUser } = require('../controllers/usersController');
const { createUserValidation, editUserValidation, idParamValidator, validateRequest } = require('../middleware/validate');

router.get('/:userId', /*
    #swagger.tags = ['Users']
    #swagger.description = 'Endpoint to retrieve a user by ID.'
    #swagger.parameters['userId'] = {
        in: 'path',
        description: 'ID of the user to retrieve',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'User retrieved successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        age: { type: 'integer' },
                        gender: { type: 'string' },
                        height: { type: 'integer' },
                        weight: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'User not found.',
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
    */ ...idParamValidator('userId'), validateRequest, getUserById);
router.post('/', /*
    #swagger.tags = ['Users']
    #swagger.description = 'Endpoint to create a new user.'
    #swagger.parameters['user'] = {
        in: 'body',
        description: 'User information',
        required: true,
        schema: {
            name: 'Nelson Mandela',
            email: 'nelson.mandela@example.com',
            age: 45,
            gender: 'Male',
            height: 180,
            weight: 75
        }
    }
    #swagger.responses[201] = {
        description: 'User created successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        userId: { type: 'string' }
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
        description: 'Bad request. Validation failed.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    */ createUserValidation, validateRequest, createUser);
router.put('/:userId', /*
    #swagger.tags = ['Users']
    #swagger.description = 'Endpoint to update an existing user.'
    #swagger.parameters['userId'] = {
        in: 'path',
        description: 'ID of the user to update',
        required: true,
        type: 'string'
    }
    #swagger.parameters['user'] = {
        in: 'body',
        description: 'Updated user information',
        required: true,
        schema: {
            name: 'Nelson Mandela Updated',
            email: 'updated.nelson.mandela@example.com',
            age: 45,
            gender: 'Male',
            height: 185,
            weight: 76
        }
    }
    #swagger.responses[200] = {
        description: 'User updated successfully.',
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
        description: 'User not found.',
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
        description: 'Bad request. Validation failed.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    */ ...idParamValidator('userId'), editUserValidation, validateRequest, editUser);
router.delete('/:userId', /*
    #swagger.tags = ['Users']
    #swagger.description = 'Endpoint to delete a user.'
    #swagger.parameters['userId'] = {
        in: 'path',
        description: 'ID of the user to delete',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'User deleted successfully.',
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
        description: 'User not found.',
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
    */ ...idParamValidator('userId'), validateRequest, removeUser);

module.exports = router;