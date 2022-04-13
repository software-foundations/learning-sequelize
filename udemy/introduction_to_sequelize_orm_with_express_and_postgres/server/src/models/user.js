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