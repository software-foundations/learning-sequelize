import jwt from 'jsonwebtoken';
import JWTUtils from '../../src/utils/jwt-utils';

describe('jwt utils', () => {
	it('should return an access token', () => {
		const payload = { email: 'test@example.com'};
		expect(JWTUtils.generateAccessToken(payload)).toEqual(expect.any(String));
	});

	it('should return an refresh token', () => {
		const payload = { email: 'test@example.com'};
		expect(JWTUtils.generateRefreshToken(payload)).toEqual(expect.any(String));
	});

	it('should verify that the access token is valid', () => {
		const payload = { email: 'test@example.com'};
		const jwt = JWTUtils.generateAccessToken(payload);
		expect(JWTUtils.verifyAccessToken(jwt)).toEqual(
			expect.objectContaining(payload));
	});

	it('should verify that the refresh token is valid', () => {
		const payload = { email: 'test@example.com'};
		const jwt = JWTUtils.generateRefreshToken(payload);
		expect(JWTUtils.verifyRereshToken(jwt)).toEqual(
			expect.objectContaining(payload));
	});

	it('should error if the access token is invalid', () => {
		// 'invalid.token cold be any invalid string'
		expect(() => JWTUtils.verifyAccessToken('invalid.token')).toThrow(
			jwt.JsonWebTokenError
		);
	});

	it('should error if the refresh token is invalid', () => {
		// 'invalid.token cold be any invalid string'
		expect(() => JWTUtils.verifyRereshToken('invalid.token')).toThrow(
			jwt.JsonWebTokenError
		);
	});
});
