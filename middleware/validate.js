const { checkSchema, validationResult, param } = require('express-validator');
const { ObjectId } = require('mongodb');

// Factory para validar parâmetros de rota que são ObjectId
const idParamValidator = (paramName) => [
    param(paramName)
        .custom((value) => ObjectId.isValid(value))
        .withMessage(`Invalid ${paramName} format. Must be a valid MongoDB ObjectId.`)
];

// Schemas validation

// User validation schemas
const createUserSchema = {
    name: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'Name is required and must be a string.'
    },
    email: {
        in: ['body'],
        isEmail: true,
        notEmpty: true,
        errorMessage: 'A valid email is required.'
    },
    age: {
        in: ['body'],
        isInt: { options: { min: 0 } },
        errorMessage: 'Age must be a non-negative integer.'
    },
    gender: {
        in: ['body'],
        isIn: {
            options: [['Male', 'Female']],
            errorMessage: 'Gender must be one of the following: Male, Female.'
        }
    },
    height: {
        in: ['body'],
        isFloat: { options: { min: 0 } },
        errorMessage: 'Height must be a non-negative number.'
    },
    weight: {
        in: ['body'],
        isFloat: { options: { min: 0 } },
        errorMessage: 'Weight must be a non-negative number.'
    }
};

const editUserSchema = {
    name: {
        in: ['body'],
        optional: true,
        isString: true,
        notEmpty: true,
        errorMessage: 'Name must be a string.'
    },
    email: {
        in: ['body'],
        optional: true,
        isEmail: true,
        notEmpty: true,
        errorMessage: 'A valid email is required.'
    },
    age: {
        in: ['body'],
        optional: true,
        isInt: { options: { min: 0 } },
        errorMessage: 'Age must be a non-negative integer.'
    },
    gender: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['Male', 'Female']],
            errorMessage: 'Gender must be one of the following: Male, Female.'
        }
    },
    height: {
        in: ['body'],
        optional: true,
        isFloat: { options: { min: 0 } },
        errorMessage: 'Height must be a non-negative number.'
    },
    weight: {
        in: ['body'],
        optional: true,
        isFloat: { options: { min: 0 } },
        errorMessage: 'Weight must be a non-negative number.'
    }
};

// Nutrition validation schemas
const createNutritionEntrySchema = {
    userId: {
        in: ['body'],
        isMongoId: true,
        notEmpty: true,
        errorMessage: 'A valid userId is required.'
    },
    mealType: {
        in: ['body'],
        isIn: {
            options: [['Breakfast', 'Lunch', 'Dinner', 'Snack']],
            errorMessage: 'Meal type must be one of the following: Breakfast, Lunch, Dinner, Snack.'
        },
        notEmpty: true,
    },
    calories: {
        in: ['body'],
        isInt: { options: { min: 0 } },
        errorMessage: 'Calories must be a non-negative integer.'
    },
    protein: {
        in: ['body'],
        isFloat: { options: { min: 0 } },
        errorMessage: 'Protein must be a non-negative number.'
    },
    carbs: {
        in: ['body'],
        isFloat: { options: { min: 0 } },
        errorMessage: 'Carbs must be a non-negative number.'
    },
    fat: {
        in: ['body'],
        isFloat: { options: { min: 0 } },
        errorMessage: 'Fat must be a non-negative number.'
    },
    date: {
        in: ['body'],
        isISO8601: true,
        toDate: true,
        errorMessage: 'A valid date is required.'
    }
};

const editNutritionEntrySchema = {
    mealType: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['Breakfast', 'Lunch', 'Dinner', 'Snack']],
            errorMessage: 'Meal type must be one of the following: Breakfast, Lunch, Dinner, Snack.'
        },
    },
    calories: {
        in: ['body'],
        optional: true,
        isInt: { options: { min: 0 } },
        errorMessage: 'Calories must be a non-negative integer.'
    },
    protein: {
        in: ['body'],
        optional: true,
        isFloat: { options: { min: 0 } },
        errorMessage: 'Protein must be a non-negative number.'
    },
    carbs: {
        in: ['body'],
        optional: true,
        isFloat: { options: { min: 0 } },
        errorMessage: 'Carbs must be a non-negative number.'
    },
    fat: {
        in: ['body'],
        optional: true,
        isFloat: { options: { min: 0 } },
        errorMessage: 'Fat must be a non-negative number.'
    },
    date: {
        in: ['body'],
        optional: true,
        isISO8601: true,
        toDate: true,
        errorMessage: 'A valid date is required.'
    }
};

// Workout validation schemas
const createWorkoutSchema = {
    userId: {
        in: ['body'],
        isMongoId: true,
        notEmpty: true,
        errorMessage: 'A valid userId is required.'
    },
    date: {
        in: ['body'],
        isISO8601: true,
        toDate: true,
        errorMessage: 'A valid date is required.'
    },
    type: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'Workout type is required and must be a string.'
    },
    duration: {
        in: ['body'],
        isInt: { options: { min: 0 } },
        errorMessage: 'Duration must be a non-negative integer.'
    },
    caloriesBurned: {
        in: ['body'],
        isInt: { options: { min: 0 } },
        errorMessage: 'Calories burned must be a non-negative integer.'
    },
    notes: {
        in: ['body'],
        optional: true,
        isString: true,
        errorMessage: 'Notes must be a string.'
    }
};

const editWorkoutSchema = {
    date: {
        in: ['body'],
        optional: true,
        isISO8601: true,
        toDate: true,
        errorMessage: 'A valid date is required.'
    },
    type: {
        in: ['body'],
        optional: true,
        isString: true,
        notEmpty: true,
        errorMessage: 'Workout type must be a string.'
    },
    duration: {
        in: ['body'],
        optional: true,
        isInt: { options: { min: 0 } },
        errorMessage: 'Duration must be a non-negative integer.'
    },
    caloriesBurned: {
        in: ['body'],
        optional: true,
        isInt: { options: { min: 0 } },
        errorMessage: 'Calories burned must be a non-negative integer.'
    },
    notes: {
        in: ['body'],
        optional: true,
        isString: true,
        errorMessage: 'Notes must be a string.'
    }
};

// Goal validation schemas
const createGoalSchema = {
    userId: {
        in: ['body'],
        isMongoId: true,
        notEmpty: true,
        errorMessage: 'A valid userId is required.'
    },
    goalType: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'Goal type is required and must be a string.'
    },
    targetValue: {
        in: ['body'],
        isFloat: { options: { min: 0 } },
        errorMessage: 'Target must be a non-negative number.'
    },
    currentValue: {
        in: ['body'],
        isFloat: { options: { min: 0 } },
        errorMessage: 'Current value must be a non-negative number.'
    },
    deadline: {
        in: ['body'],
        isISO8601: true,
        toDate: true,
        errorMessage: 'A valid deadline date is required.'
    },
    status: {
        in: ['body'],
        isIn: {
            options: [['Not Started', 'In Progress', 'Completed']],
            errorMessage: 'Status must be one of the following: Not Started, In Progress, Completed.'
        }
    }
};

const editGoalSchema = {
    targetValue: {
        in: ['body'],
        optional: true,
        isFloat: { options: { min: 0 } },
        errorMessage: 'TargetValue must be a non-negative number.'
    },
    currentValue: {
        in: ['body'],
        optional: true,
        isFloat: { options: { min: 0 } },
        errorMessage: 'CurrentValue must be a non-negative number.'
    },
    deadline: {
        in: ['body'],
        optional: true,
        isISO8601: true,
        toDate: true,
        errorMessage: 'A valid deadline date is required.'
    },
    status: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['Not Started', 'In Progress', 'Completed']],
            errorMessage: 'Status must be one of the following: Not Started, In Progress, Completed.'
        }
    }
};

// Validation middleware
function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const createUserValidation = checkSchema(createUserSchema);
const editUserValidation = checkSchema(editUserSchema);
const createNutritionEntryValidation = checkSchema(createNutritionEntrySchema);
const editNutritionEntryValidation = checkSchema(editNutritionEntrySchema);
const createWorkoutValidation = checkSchema(createWorkoutSchema);
const editWorkoutValidation = checkSchema(editWorkoutSchema);
const createGoalValidation = checkSchema(createGoalSchema);
const editGoalValidation = checkSchema(editGoalSchema);

module.exports = {
    createUserValidation,
    editUserValidation,
    createNutritionEntryValidation,
    editNutritionEntryValidation,
    createWorkoutValidation,
    editWorkoutValidation,
    createGoalValidation,
    editGoalValidation,
    idParamValidator,
    validateRequest
};