/* Remember config/index.js import all environment variavles

	- index.js

		import dotenv from 'dotenv';

		dotenv.config();
*/
import './config';

// It import index.js from ./database folder
import Database from './database/';

// Import environment variable from ./config/environment.js
import environment from './config/environment'

// Import dbConfig from ./config/database.js
import dbConfig from './config/database'

// IIFE = Immediately Invoked Function Expression
// It means that a funciton will be executed after its definition
(async () => {

	try {

		const db = new Database(environment.nodeEnv, dbConfig);

		await db.connect();

	} catch(err) {
		console.error(
			'Something went wrong when initialize the server:\n', err.stack
		);
	}

})();
