# Json Web Token (JWK)

<div>
	<a href="https://jwt.io/introduction">JWT</a>	
</div>

## Structure

```console
header.payload.signature
```

## Header

```json
{
	"alg": "HS256",
	"type": "JWT"
}
```

## Payload

- Contains 3 types of claims

```console
Registered claims
Public claims
Private claims
```

### Registered Claims

<div>
	<a href="https://datatracker.ietf.org/doc/html5/rfc7519#section-4.1">Link to registered claims</a>
</div>

- Are prefefined claims

- Examples

```console
iss (issuer)
exp (expiration time)
sub (subject)
aud (audience)
```

### Public Claims

<div>
	<a href="https://www.iana.org/assignments/jwt/jwt.xhtml5">See IANA JSON Web Token Registry<a>
</div>
```

- These can be defined at will by those using JWTs

- To avoid collisions, they'ld be defined in the IANA JSON Web Token Resigstry

- Or, be defined as a URI that contains a collision resistant namespace

## Private Claims

- Are Custom claims created to share information between parties

- These parties agree on using them

- These parties are neighter registered or public


### Payload example

```json
{
	"sub": "1234567890",
	"name": "John Doe",
	"admin": true
}
```

- The payload is then __Base65Url__ encoded

- This encoded payload form the second part of the JWT

__Do note that for signed tokens this information,__
__though proteced against tampering,__
__is readable by anyone.__

__Do not put secret information__
__in the payload or header elements__
__of a JWT unless it is encrypted__

## Signature

- To create the signature part
you have to take:

<div>
	<ol>
		<li>Encoded header</li>
		<li>Encoded payload</li>
		<li>A secret</li>
		<li>The algorithm specified in the header</li>
		<li>And sign that</li>
	</ol>
</div>

- Example

```bash
# If you want to use the HMAC SHA256 algoritgm
# the signature will be created in the following way

{
	HMACSHA256
	(
		base64UrlEncoded(header) + "." +
		base64UrlEncoded(payload),
		secret
	)
}
```

__The signature is used to verify the message__
__wasn't changed along the way, and,__
__in the case of of tokens signed with a private key,__
__it can also verify that the sender of the JWT is who it says it is__

## Putting all together

<div>
	<a href="https://jwt.io/">JWT.io</a>
</div>

# How JSON Web Tokens work?

<div style="text-align:justify;">
	<p>In authentication,when the user successfully logs inusing their credentials, a JWT will be returned</p>
	<br>
	<p>Since tokens are credentials, great care must be taken to prevent security issues</p>
	<br>
	<p>In general, you should not keep tokend longer than required</p>
	<br><br>
	<a>
		<strong>
			You also should not store sensitive session data in browser storage due to lack of security
		</strong>
	</a>
	<br><br>
	<p>Whenever the user wants to access a protected route or resource, the user agent should send the JWT, typically in the Autorization header using the Bearer schema</p>
	<br>
	<p>The content of the header should like the following</p>
</div>

```console
Authorization: Bearer <token>
```

<div style="text-align:justify;">
	<p>This can be, in certain cases, a stateless authotization mechanisms. The server's protected routes will check for a valid JWT in the Authorization header, and if it's present, the user will be allowed to access protected resources. If the JWT contains the necessary data, the need to query the database for certain operations may be reduced, though, this may not always be the case</p>
	<br>
	<p>Is the token is sent in the Authorization header, Cross-Origin Resource Sharing (CORS) won't be an issue as it doesn't use cookies</p>
	<br>
	<p>The following steps show how a JWT is obtained and used to access APIs or resources</p>
	<br>
	<ol>
		<li><strong>The application or client request authorization to the authorization server</strong>. This is performed through one of the different authorization flows. For example, a typical <i>OpenID Connect</i> compilan web application will go thourgh the <i style="color:red;">/oauth/authorize</i> endpoint using the <i style="color:blue"></i>authorization code flow</li>
		<li>When the authorization is granted, the authorization server returns an access token to the application</li>
		<li>The application uses the access token to access a protected resource (like an API)</li>
	</ol>
	<br>
	<p>Do note that with signed tokens, all the information contained within the token is exposed to users or other parties, even though they are unable to change it. This means you should not push not secret information within the token</p>
</div>

---

# Bcrypt

<div>
	<a href="https://auth0.com/blog/hashing-in-action-understanding-bcrypt/">Bcrypt</a>
</div>

## Introduction

<div style="text-align:justify">
	<p>The bcrypt hashing function allow us to build a password security platform that scales with computation power and always hashes every password with a salt</p>
	<p>There are plenty of cryptographic functions to choose from such as the SHA2 family and the SHA-3 family. However, one design problem with the SHA families is that they were designed to be computationally fast. How fast a cryptographic function can calculate a hash has an immediate and significant bearing on how safe the password is.</p>
	<p>Faster calculations mean faster brute-force attacks, for example. Modern hardware in the form of CPUs and GPUs could compute millions, or even billions, of SHA-256 hashes per second against a stolen database. Instead of a fast function, we need a function that is slow at hashing passwords to bring attackers almost to a halt. We also want this function to be adaptive so that we can compensate for future faster hardware by being able to make the function run slower and slower over time.</p>
	<p>At Auth0, the integrity and security of our data are one of our highest priorities. We use the industry-grade and battle-tested bcrypt algorithm to securely hash and salt passwords. bcrypt allows building a password security platform that can evolve alongside hardware technology to guard against the threats that the future may bring, such as attackers having the computing power to crack passwords twice as fast. Let's learn about the design and specifications that make bcrypt a cryptographic security</p>
</div>

## Motivation Behind bcrypt

<div style="text-indent:justify;">
	<p>Technology changes fast. Increasing the speed and power of computers can benefit both the engineers trying to build software systems and the attackers trying to exploit them. Some cryptographic software is not designed to scale with computing power. As explained earlier, the safety of the password depends on how fast the selected cryptographic hashing function can calculate the password hash. A fast function would execute faster when running in much more powerful hardware.</p>
	<p>To mitigate this attack vector, we could create a cryptographic hash function that can be tuned to run slower in newly available hardware; that is, the function scales with computing power. This is particularly important since, through this attack vector, people tend to keep the length of the passwords constant. Hence, in the design of a cryptographic solution for this problem, <strong>we must account for rapidly evolving hardware and constant password length.</strong></p>
	<p>This attack vector was well understood by cryptographers in the 90s and an algorithm by the name of <code class="language-js">bcrypt</code> that met these design specifications was presented in 1999 at USENIX. Let's learn how <code class="language-js">bcrypt</code> allows us to create strong password storage systems.</p>
</div>

## What is bcrypt ?

<div style="text-align:justify;">
	<p><code class="language-js">bcrypt</code>was designed by Niels Provos and David Mazières based on the Blowfish cipher>): <code class="lanaguage-js">b</code> for Blowfish and <code class="lanaguage-js">crypt</code> for the name of the hashing function used by the UNIX password system.</p>
	<p><code class="language-js">crypt</code> is a great example of failure to adapt to technology changes. According to USENIX, in 1976, <code class="language-js">crypt</code> could hash fewer than 4 passwords per second. Since attackers need to find the pre-image of a hash in order to invert it, this made the UNIX Team feel very comfortable about the strength of <code class="language-js">crypt</code>. However, 20 years later, a fast computer with optimized software and hardware was capable of hashing 200,000 passwords per second using that function!</p>
	<p>Inherently, an attacker could then carry out a complete dictionary attack with extreme efficiency. Thus, cryptography that was exponentially more difficult to break as hardware became faster was required in order to hinder the speed benefits that attackers could get from hardware.</p>
	<p>The Blowfish cipher is a fast block cipher except when changing keys>), the parameters that establish the functional output of a cryptographic algorithm: each new key requires the pre-processing equivalent to encrypting about 4 kilobytes of text>), which is considered very slow compared to other block ciphers. This slow key changing is beneficial to password hashing methods such as bcrypt since the extra computational demand helps protect against dictionary and brute force attacks by <strong>slowing down the attack.</strong></p>
	<p>As shown in "Blowfish in practice">), <code class="language-js">bcrypt</code> is able to mitigate those kinds of attacks by combining the expensive key setup phase of Blowfish with a variable number of iterations to increase the workload and duration of hash calculations. The largest benefit of <code class="language-js">bcrypt</code> is that, over time, the iteration count can be increased to make it slower allowing <code class="language-js">bcrypt</code> to scale with computing power. We can dimish any benefits attackers may get from faster hardware by increasing the number of iterations to make <code class="language-js">bcrypt</code> slower.</p>
	<br>
	<p>So, bcrypt was a slow hashing algorithm wich slow even more when the power of the hardware increases</p>
</div>

---

# Adding environment variables

```bash
mkdir src/config
touch src/config/index.js
touch src/config/database.js
touch src/config/environment.js

```

- index.js

```javascript
import dotenv from 'dotenv';
dotenv.config();
```

- database.js

```javascript
module.exports = {
	development: {
		username: process.env.DB_USERNAME || 'postgres',
		password: process.env.DB_PASSWORD || 'postgres',
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT) || 5432,
		database: process.env.DB_DATABASE || 'postgres',
		dialect: 'postgres',	
	},
	test: {
		username: process.env.DB_TEST_USERNAME || 'postgres',
		password: process.env.DB_TEST_PASSWORD || 'postgres',
		host: process.env.DB_TEST_HOST || 'localhost',
		port: parseInt(process.env.DB_TEST_PORT) || 5433,
		database: process.env.DB_TEST_DATABASE || 'postgres',
		dialect: 'postgres',
	},
	// production: {},
};
```

- environment.js

```javascript
export default {
	port: parseInt(process.env.PORT) || 8080,
	nodeEnv: process.env.NODE_ENV || 'production',

	// saltRounds specify the dificult of the hash function
	saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,

	jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || '3416b43d0b38ce33ad33c751ff3612bb0e5afa32e64313a7f9561b32afd84e1a',

	jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'c351813ce840f1d287efd45772ab36b28bf5a0c652e32d463f98854a8a073cbb',
};
```

- Getting default __jwtAccessTokenSecret__ provided by crypto random function

```javascript
// In node console
require("crypto")
crypto.randomBytes(32).toString("hex")

output:
	'3416b43d0b38ce33ad33c751ff3612bb0e5afa32e64313a7f9561b32afd84e1a'
```

- Getting default __jwtRefreshTokenSecret__ provided by crypto random function

```javascript
// In node console
require("crypto")
crypto.randomBytes(32).toString("hex")

output:
	'c351813ce840f1d287efd45772ab36b28bf5a0c652e32d463f98854a8a073cbb'
```