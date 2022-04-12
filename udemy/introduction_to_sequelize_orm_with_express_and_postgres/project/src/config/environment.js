export default {
	port: parseInt(process.env.PORT) || 8080,
	nodeEnv: process.env.NODE_ENV || 'production',

	// saltRounds specify the dificult of the hash function
	saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,

	jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || '3416b43d0b38ce33ad33c751ff3612bb0e5afa32e64313a7f9561b32afd84e1a',

	jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'c351813ce840f1d287efd45772ab36b28bf5a0c652e32d463f98854a8a073cbb',
};