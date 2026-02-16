/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('smart-fitness-tracker');

// Seed data for users, workouts, goals, and nutrition.

const userIds = [
	new ObjectId(),
	new ObjectId(),
	new ObjectId(),
	new ObjectId()
];

db.users.insertMany([
	{
		_id: userIds[0],
		name: 'Ana Silva',
		email: 'ana.silva@example.com',
		age: 28,
		gender: 'Female',
		height: 165,
		weight: 62,
		createdAt: '2024-01-15T10:00:00Z'
	},
	{
		_id: userIds[1],
		name: 'Bruno Costa',
		email: 'bruno.costa@example.com',
		age: 34,
		gender: 'Male',
		height: 178,
		weight: 80,
		createdAt: '2024-01-20T09:30:00Z'
	},
	{
		_id: userIds[2],
		name: 'Carla Mendes',
		email: 'carla.mendes@example.com',
		age: 25,
		gender: 'Female',
		height: 170,
		weight: 68,
		createdAt: '2024-02-01T08:15:00Z'
	},
	{
		_id: userIds[3],
		name: 'Diego Rocha',
		email: 'diego.rocha@example.com',
		age: 41,
		gender: 'Male',
		height: 182,
		weight: 85,
		createdAt: '2024-02-10T11:45:00Z'
	}
]);

db.workouts.insertMany([
	{
		_id: new ObjectId(),
		userId: userIds[0],
		date: new Date('2024-03-01T07:00:00Z'),
		type: 'Running',
		duration: 45,
		caloriesBurned: 420,
		notes: 'Morning run'
	},
	{
		_id: new ObjectId(),
		userId: userIds[1],
		date: new Date('2024-03-02T18:30:00Z'),
		type: 'Cycling',
		duration: 60,
		caloriesBurned: 520,
		notes: 'Evening ride'
	},
	{
		_id: new ObjectId(),
		userId: userIds[2],
		date: new Date('2024-03-03T12:00:00Z'),
		type: 'Strength',
		duration: 50,
		caloriesBurned: 380,
		notes: 'Upper body'
	},
	{
		_id: new ObjectId(),
		userId: userIds[3],
		date: new Date('2024-03-04T06:30:00Z'),
		type: 'Yoga',
		duration: 40,
		caloriesBurned: 180,
		notes: 'Flexibility session'
	}
]);

db.goals.insertMany([
	{
		_id: new ObjectId(),
		userId: userIds[0],
		goalType: 'Weight Loss',
		targetValue: 5,
		currentValue: 1,
		deadline: new Date('2024-06-30T23:59:59Z'),
		status: 'In Progress'
	},
	{
		_id: new ObjectId(),
		userId: userIds[1],
		goalType: 'Run Distance',
		targetValue: 100,
		currentValue: 35,
		deadline: new Date('2024-07-31T23:59:59Z'),
		status: 'In Progress'
	},
	{
		_id: new ObjectId(),
		userId: userIds[2],
		goalType: 'Strength',
		targetValue: 20,
		currentValue: 8,
		deadline: new Date('2024-08-15T23:59:59Z'),
		status: 'In Progress'
	},
	{
		_id: new ObjectId(),
		userId: userIds[3],
		goalType: 'Consistency',
		targetValue: 30,
		currentValue: 12,
		deadline: new Date('2024-05-31T23:59:59Z'),
		status: 'In Progress'
	}
]);

db.nutrition.insertMany([
	{
		_id: new ObjectId(),
		userId: userIds[0],
		mealType: 'Breakfast',
		foodItems: ['Oats', 'Banana', 'Yogurt'],
		calories: 420,
		protein: 18,
		carbs: 62,
		fat: 10,
		date: new Date('2024-03-01T08:00:00Z')
	},
	{
		_id: new ObjectId(),
		userId: userIds[1],
		mealType: 'Lunch',
		foodItems: ['Chicken', 'Rice', 'Salad'],
		calories: 650,
		protein: 45,
		carbs: 70,
		fat: 18,
		date: new Date('2024-03-01T13:00:00Z')
	},
	{
		_id: new ObjectId(),
		userId: userIds[2],
		mealType: 'Snack',
		foodItems: ['Nuts', 'Apple'],
		calories: 220,
		protein: 6,
		carbs: 25,
		fat: 12,
		date: new Date('2024-03-01T16:00:00Z')
	},
	{
		_id: new ObjectId(),
		userId: userIds[3],
		mealType: 'Dinner',
		foodItems: ['Fish', 'Quinoa', 'Vegetables'],
		calories: 520,
		protein: 35,
		carbs: 50,
		fat: 16,
		date: new Date('2024-03-01T20:00:00Z')
	}
]);