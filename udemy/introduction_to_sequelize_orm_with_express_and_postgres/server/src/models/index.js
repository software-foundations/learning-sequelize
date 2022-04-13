import fs from 'fs';
import path from 'path';

let models = {};

// remember that registerModels needs a sequelize connection
export function registerModels(sequelize) {

	// __filename means the name of this file: index.js
	const thisFile = path.basename(__filename);

	// __dirname means the relative path to this file
	// /home/bruno/Documents/dev/learning-sequelize/udemy/introduction_to_sequelize_orm_with_express_and_postgres/server/src/models/
	const modelFiles = fs.readdirSync(__dirname);

	// Filtering all of the model files
	// It is an array of files
	const filteredModelFiles = modelFiles.filter( (file) => {
		return file !== thisFile && file.slice(-3) === '.js';
	});

	// Lets iterate of this array of files
	for(const file of filteredModelFiles) {

		// Lets import or require the file
		// We are going to pass the sequelize instance inside the default
		const model = require(path.join(__dirname, file)).default(sequelize);
		// Now, we have the class representing the model

		// Lets insert model object into the models object
		models[model.name] = model;
	}

	// So now we have populated our models object
	// It is time to actually call the associate method for each of these models
	// Remember: the keys are the name of the models
	Object.keys(models).forEach( (modelName) => {

		// In this associate methods we are going to pass all of the models.
		// That's why first we need to populate all of these models object
		// and then we need to call this associate
		if (models[modelName].associate(models)) {
			models[modelName].associate(models);
		}
	});

	// Setting an aditional key apart from the models
	// and that is going to be the sequelize licenses.
	// So, apart from the models, these models object is going to have
	// the same instance as well
	models.sequelize = sequelize;
}

export default models;
