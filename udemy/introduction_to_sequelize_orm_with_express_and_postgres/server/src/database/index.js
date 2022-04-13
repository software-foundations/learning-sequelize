import cls from 'cls-hooked';
import { Sequelize } from 'sequelize';

export default class Database {
	constructor(environment, dbConfig) {
		this.environment = environment;
		this.dbConfig = dbConfig;
		this.isTestEnvironment = this.environment === 'test';
	};

	async connect() {
		/*
		Why we are doing this?

		Basically, see sequelize transaction documentation above
		
		*/

		// Set up the namespace for transactions
		// remember that we are use cls-hooked

		// You can put whatever you want in the place of 'transaction-namespace'
		const namespace = cls.createNamespace('transactions-namespace');
		Sequelize.useCLS(namespace);

		// Create the connection
		// this.environment can be test, production, or whatever
		// this.dbConfig is gonna be src/config/database.js content

		const { username, password, host, port, database, dialect } = this.dbConfig[this.environment];
		this.connection = new Sequelize({ 
			username,
			password,
			host,
			port,
			database,
			dialect,
			logging: this.isTestEnvironment ? false: console.log,
		});

		// Check if we connected successfully
		await this.connection.authenticate({ logging: false });

		if(!this.isTestEnvironment) {
			console.log('Connection to the database has been established successfully')
		}

		// Register the models
		RegisterModels(this.connection)

		// Sync the models
		await this.sync();

	};

	async disconnect() {
		await this.connection.close();

	};

	async sync() {
		await this.connection.sync({
			logging: false,
			force: this.isTestEnvironment,
		})

		if (!this.isTestEnvironment) {
			console.log("Connection synced successfully");
		};

	};
};