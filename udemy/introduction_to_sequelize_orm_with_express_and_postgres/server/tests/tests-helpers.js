import '../src/config';
import Database from '../src/database';
import dbConfig from '../src/config/database';

let db;

export default class TestsHelpers {

	static async startDb() {

		db = new Database(environment='test', dbConfig);

		await db.connect();

		return db;

	}

	static async stopDb() {

		await db.disconnect();
	}

	// Test Database reset
	static async syncDb() {

		// in this case, force is going to be true
		// So, each time we run a test, we're going to drop all of the tables and have a test
		// So, we are goingo to run the Sync DB comment before each test

		await db.sysnc();
	}

}