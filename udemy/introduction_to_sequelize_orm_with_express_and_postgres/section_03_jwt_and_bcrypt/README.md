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