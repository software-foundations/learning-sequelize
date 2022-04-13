import { Model, DataTypes } from 'sequelize';

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
					// If its not an email, we are going to say not a valid email
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
		{sequelize, modelName: 'User'}
	);

	return User;
}