const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Smart Fitness Tracker API',
        description: 'API documentation for the Smart Fitness Tracker application.'
    },
    tags: [
        {
            name: 'Users',
            description: 'Operations related to users'
        },
        {
            name: 'Goals',
            description: 'Operations related to goals'
        },
        {
            name: 'Nutrition',
            description: 'Operations related to nutrition entries'
        },
        {
            name: 'Workouts',
            description: 'Operations related to workouts'
        }
    ],
    //host: 'localhost:8080',
    //schemes: ['http']
    host: 'smart-fitness-tracker-knr2.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js');
});