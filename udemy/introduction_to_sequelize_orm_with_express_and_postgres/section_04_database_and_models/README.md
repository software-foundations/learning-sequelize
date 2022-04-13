# Creating the database class

<div>
	<a href="https://sequelize.org/docs/v6/other-topics/transactions/">Sequelize transaction Documentation</a>
</div>

<div style="text-indent:justify;">
	<p>Sequelize does not use transactions by default</p>
	<p>However, <strong>for production, you must set Sequelize to use transaction</strong></p>
	<br>
	<p>Supported ways of use transactions in sequelize</p>
	<ol>
		<li><strong>Unmanaged transactions:</strong>: Committing and rolling back the transaction should be done manually by the user (by calling the appropriate Sequelize methods).</li>
		<li><strong>Managed transactions:</strong> Sequelize will automatically rollback the transaction if any error is thrown, or commit the transaction otherwise. Also, if CLS (Continuation Local Storage) is enabled, all queries within the transaction callback will automatically receive the transaction object.</li>
	</ol>
	<p>See <a href="https://sequelize.org/docs/v6/other-topics/transactions/">Automatically pass transactions to all queries</a></p>
</div>

```bash
cd server/src
mkdir database
touch index.js
```

- index.js

```javascript
import cls from 'cls-hooked';
import { Sequelize } from 'sequelize';
import { registerModels } from '../models';

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
		// RegisterModels(this.connection)

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
```

<div>
	<a href="https://sequelize.org/docs/v6/core-concepts/model-basics/#:~:text=Model%20synchronization%E2%80%8B&text=This%20is%20where%20model%20synchronization,SQL%20query%20to%20the%20database.">Model synchronization Documentation</a>
</div>

<div style="text-align:justify;">
	<p>When you define a model, you're telling Sequelize a few things about its table in the database. However, what if the table actually doesn't even exist in the database? What if it exists, but it has different columns, less columns, or any other difference?</p>
	<p>This is where model synchronization comes in. A model can be synchronized with the database by calling model.sync(options), an asynchronous function (that returns a Promise). With this call, Sequelize will automatically perform an SQL query to the database. Note that <strong>this changes only the table in the database, not the model in the JavaScript side</strong>.</p>
	<br>
	<ol>
		<li><code>User.sync()</code> - This creates the table if it doesn't exist (and does nothing if it already exists)</li>
		<li><code>User.sync({ force: true })</code> - This creates the table, dropping it first if it already existed. <strong>It is good for testing, but not good for production</strong></li>
		<li><code>User.sync({ alter: true })</code> - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model</li>
	</ol>
	<br>
	<p><strong>So, in production, we don't want the ORM to determine how the table should be created and things like that</strong></p>
	<p><strong>That's why we are going to create MIGRATIONS for our tables</strong></p>

</div>

# Register the models

## Register Models function

- Basically, it make two things

<div style="text-align:justify">
	<ol>
		<li>First, <code>Register Models function</code> put all of the models inside an object, which we are going to call model objects</li>
			<ul>
				<li>The keys of these objects are going to be the names of the models</li>
				<li>And the values of these keys are going to be the class representing the models</li>
			</ul>
		<li>The second thing is <code>Register Models function</code> is going to associate static method from each of these classes representin the models
			<ul>
				<li>This associate method is going to say, for example<i>hey, this model has a relationship, a 1:1 relationship with this other model. An this model belongs to this model or this model as a 1:n relationship with these other models</i></li>
			</ul>
		</li>
	</ol>
	<br>
	<p><strong>So, those are the associations that we are going to regster in these static method called associate</strong></p>
	
</div>

## Create the models

```bash
mkdir server/src/models
touch server/src/models/index.js
```

- index.js

```javascript
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
```
<div style="text-align:justify">
	<p>Now, we need to <strong>/register the models</strong></p>
</div>

## Uncomment registerModels(this.connection) in server/src/database/index.js

- index.js

```javascript
// Register the models
registerModels(this.connection)
```

# Adding the server

<div style="text-align:justify">
	<ul>
		<li>The server is responsible for
			<ol>
				<li>Connecting to the database</li>
				<li>Creating express app</li>
				<li>Listening the port that we specify</li>
			</ol>
		</li>
	</ul>
	
</div>

## Creating the server file

```bash
touch server/src/server.js
```

- server.js

```javascript
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
```

## Run the server

```bash
cd /server
npm run dev
```

- output

```console
/postgres/connection-manager.js:184:24)
    at Client._handleErrorWhileConnecting (/home/bruno/Documents/dev/learning-sequelize/udemy/introduction_to_sequelize_orm_with_express_a
nd_postgres/server/node_modules/pg/lib/client.
js:305:19)
    at Client._handleErrorMessage (/home/bruno
/Documents/dev/learning-sequelize/udemy/introd
uction_to_sequelize_orm_with_express_and_postg
res/server/node_modules/pg/lib/client.js:325:1
9)
    at Connection.emit (events.js:400:28)
    at Connection.emit (domain.js:470:12)
    at /home/bruno/Documents/dev/learning-sequ
elize/udemy/introduction_to_sequelize_orm_with
_express_and_postgres/server/node_modules/pg/l
ib/connection.js:114:12
[nodemon] clean exit - waiting for changes bef
ore restart
```

- Up the containered databases

```bash
cd server/

# Avoid port conflicts
sudo systemctl stop postgresql@13-main.service
sudo systemctl stop postgresql.service

sudo systemctl status postgresql@13-main.service
sudo systemctl status postgresql.service

sudo docker-compose up -d
```

- run server

```bash
npm run dev
```

- output

```console
> server@1.0.0 dev /home/bruno/Documents/dev/learning-sequelize/udemy/introduction_to_sequelize_orm_with_express_and_postgres/server                                
> NODE_ENV=development nodemon --exec babel-node src/server.js                    
                                         
[nodemon] 2.0.12                         
[nodemon] to restart at any time, enter `rs`                                      
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `babel-node src/server.js`
Connection to the database has been established successfully
Connection synced successfully
[nodemon] clean exit - waiting for changes before restart
```

# Adding tests helpers

<div style="text-align:justify;">
	<ul>
		<li>Before adding our models, we need some tests helpers</li>
		<li>These helpers are going to make our tests easier</li>
	</ul>
</div>

```bash
touch server/tests/tests-helpers.js
```

- tests-helpers.js

```javascript
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
```

# Models overview

<div style="">
	<p>We will have 3 models</p>
	<ul>
		<li>User</li>
		<li>Refresh Token</li>
		<li>Roles</li>
	</ul>
	<br>
	<h2>User model</h2>
	<ul>
		<li>User will have many roles</li>
		<li>User will have one refresh token</li>
		<li>Properties</li>
		<ul>
			<li>email</li>
			<li>password</li>
			<li>username</li>
			<li>firstName</li>
			<li>lastName</li>			
		</ul>
	</ul>
	<br>
	<h2>Roles model</h2>
	<ul>
		<li>Roles will belong to a User</li>
		<li>Properties</li>
		<ul>
			<li>role (string)</li>
		</ul>
	</ul>
	<br>
	<h2>Refresh Token model</h2>
	<ul>
		<li>Refresh Token will belong to a User</li>
		<li>Properties</li>
		<ul>
			<li>token (string)</li>
		</ul>
	</ul>
	<br>
	<h2>Roles model</h2>
	<ul>
		<li>Roles will belong to a User</li>
		<li>Properties</li>
		<ul>
			<li>role (string)</li>
		</ul>
	</ul>
</div>

# Creating the User model

<div>
	<a href="Associations">Associations</a>
</div>

<div style="text-align:justify">
	<p>Sequelize supports the standard associations: One-To-One, One-To-Many and Many-To-Many.</p>
	<p>To do this, Sequelize provides four types of associations that should be combined to create them</p>
	<ul>
		<li>The <code>HasOne</code> association</li>
		<li>The <code>BelongsTo</code> association</li>
		<li>The <code>HasMany</code> association</li>
		<li>The <code>BelongsToMany</code> association</li>
	</ul>
</div>

<a href="https://sequelize.org/docs/v6/core-concepts/model-basics/">Model Definition</a>

<div style="text-align:justify">
	<p>Models can be defined in two equivalent ways in Sequelize</p>
	<ul>
		<li>Calling <code>sequelize.define(modelName, attributes, options)</code></li>
		<li>Extending Model and calling <code>init(attributes, options)</code></li>
	</ul>
	<br>
	<p>After a model is defined, it is available within <code>sequelize.models</code> by its model name.</p>
</div>

<a href="https://www.npmjs.com/package/bcrypt">Bcrypt</a>

<div style="text-align:justify">
	<p>bcrypt uses whatever Promise implementation is available in <code>global.Promise</code>. NodeJS >= 0.12 has a native Promise implementation built in. However, this should work in any Promises/A+ compliant implementation.</p>
	<p>Async methods that accept a callback, return a <code>Promise</code> when callback is not specified if Promise support is available.</p>
	<br>
	<h2>Example of bcrypt.compare usage</h2>
	<code>
		// Load hash from your password DB.
		bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
		    // result == true
		});
	</code>
</div>
<a href="https://sequelize.org/docs/v6/other-topics/hooks/">Models.beforeSave</a>

<a href="https://github.com/sequelize/sequelize/blob/v6/src/hooks.js#L7">Available hooks</a>

<div style="text-align:justify">
	<p>Hooks (also known as lifecycle events), are functions which are called before and after calls in sequelize are executed. For example, if you want to always set a value on a model before saving it, you can add a <code>beforeUpdate</code> hook.</p>
	<p><strong>Note:</strong> <i>Arguments to hooks are passed by reference. This means, that you can change the values, and this will be reflected in the insert / update statement. A hook may contain async actions - in this case the hook function should return a promise.</i></p>
	<br>
	<h2>Declaring Hooks</h2>
	<p>Arguments to hooks are passed by reference. This means, that you can change the values, and this will be reflected in the insert / update statement. A hook may contain async actions - in this case the hook function should return a promise.</p>
	<p>There are currently three ways to programmatically add hooks:</p>
	<ol>
		<li>Via the <code>.init()</code> method</li>
		<li>Via the <code>.addHook()</code> method</li>
		<li>Via the direct method</li>
	</ol>
	<p>Example of hooks</p>
	<ul>
		<li>
			<code>beforeSave(instance, options)</code>:	A hook that is run before creating or updating a single instance, It proxies <code>beforeCreate</code> and <code>beforeUpdate</code>
		</li>
	</ul>
</div>

```bash
touch server/src/models/user.js
```

- user.js

```javascript
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import environment from '../config/environment'

export default (sequelize) => {

	class User extends Model {

		static associate(models) {

			// User.<RefreshToken> can be whatever you want
			// We doesn't even have to assign to these two properties
			// We will see later that we need to assign to the properties
			User.RefreshToken = User.hasOne(models.RefreshToken);

			User.Roles = User.hasMany(models.Role);

		}

		static async hashPassword(password) {

			// bcrypt.hash returns a promise
			return bcrypt.hash(
				data=password, saltOrRound=environment.saltRounds
			);

		}

		static async createNewUser({
			email,
			password,
			roles,
			username,
			firstName,
			lastName,
			refreshToken,
		}) {

			// Transactions allow us to rollback all of the changes
			// This transaction excpect a callback
			return sequelize.transaction(async () => {

				let rolesToSave = [];

				// roles = ["customer", "admin"]
				if(roles && Array.isArray(roles))
				{
					rolesToSave = roles.map(role => ({ role }))
					// rolesToSave = {role: "customer", role: "admin"}
				}

				// Here comes all the logic to create a new user
				await User.create(
					{
						email,
						password,
						username,
						firstName,
						lastName,
						RefreshToken:
						{
							token: refreshToken
						},

						// It need to be an array of objects
						// Roles: [{role: 'customer', role: 'admin'}]
						Roles: rolesToSave,
					},
					{
						include: [User.RefreshToken, User.Roles]
					},
				);
			});
		}
	}

	// Defining the properties of the user model
	User.init(
		{
			email: 
			{
				// Define a String with lentgh 100
				type: DataTypes.STRING(100),

				allowNull: false,

				// Means that we are going to create a index to the email field
				unique: true,

				validate:
				{
					// If it isn't an email, say it is not a valid email
					isEmail:
					{
						msg: 'Not a valid email address',
					},
				},
			},

			password:
			{
				type: DataTypes.STRING,
				allowNull: false,
			},

			username:
			{
				type: DataTypes.STRING(50),
				unique: true,
				validate:
				{
					// length
					len:
					{
						// [<minimum>, <maximum>]
						args: [2, 50],
						msg: "userName must contain between 2 and 50 characters",
					},
				},
			},

			firstName:
			{
				type: DataTypes.STRING(50),
				validate:
				{
					len:
					{
						args: [3, 50],
						msg: "firstName must contain between 3 and 50 characters",
					}
				}
			},

			lastName:
			{
				type: DataTypes.STRING(50),
				validate:
				{
					len:
					{
						args: [3, 50],
						msg: "lastName must contain between 3 and 50 characters",
					}
				}
			},
		},

		// the second argument its an option object
		// the defaultScope
		{
			sequelize,
			modelName: 'User',
			defaultScope: { attributes: {exclude: ['password']}},
			scope:
			{
				// Scope which allows pass password to the query
				withPassword:
				{
					attributes: { include: ['password'] },
				},
			}
		}
	);

	// Create instance method
	// User.prototype.<someMethod>

	/*
	user = await User.findOne({ where: {email: 'test@example.com'} })
	user.email, user.username, user.firstName, user.lastName, user.password
	await user.comparePasswords('test123#')

	Even if the password is hashed, we don't want to expose
	that password to anyone.

	However, we expose when we need it. We're going to pass in scope and say:
		"Hey, including the query the password, but otherwise,
		we are notgoing to include the password"

	*/

	// this method returns a boolean
	User.prototype.comparePasswords = async function(password) {
		return bcrypt.compare(password, this.password)
	}

	// A hook is a code which run after or before certain action

	// hook
	// It hashes password before save it the User model
	// NEVER SAVE PLAIN TEXT
	User.beforeSave(async (user, options) => {
		const hashedPassword = await User.hashPassword(user.password);
		user.password = hashedPassword;
	});

	return User;
}
```

# Create a role model

```bash
mkdir server/src/models/role.js
```
<a href="https://sequelize.org/docs/v6/core-concepts/assocs/">Belongs To</a>

<div style="text-align:justify">
	<p>For example, we have the models <code>Team</code> and <code>Player</code>. We want to tell Sequelize that there is a <strong>One-To-Many</strong> relationship between them, meaning that <i>one Team has many Players, while each Player belongs to a single Team</i></p>
	<p>The code to reach this is below</p>
	<code>Team.hasMany(Player);</code>
	<code>Player.belongsTo(Team);</code>
</div>

- role.js

```javascript
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {

	class Role extends Model
	{

		static associate(models)
		{

			Role.belongsTo(models.User);

		}
	}

	Role.init(
		{
			role:
			{
				type: DataTypes.STRING
			},
		},
		{
			sequelize,
			modelName: 'Role'
		}
	);

	return Role;
}

```