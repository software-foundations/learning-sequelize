# Inside project folder, create .nvmrc

```bash
touch .nvmrc

nvm list
```

.nvmrc

```node
14.17.4
```

---

# Inside projet folder, use node defined in .nvmrc

```bash
nvm install 14.17.4

nvm use 14.17.4

nvm alias default 14.17.4

nvm list

node --version
```

---

# Create node project

```bash
npm init -y
```

---

# On VSCode, install prettier

---

# In folder project, create .prettierrc

.prettierrc

```json
{
	"trailingComma": "es5",
	"semi": true,
	"singleQuote": true,
	"quoteProps": "consistent",
	"printWidth": 80,
	"tabWidth": 2
}
```

---

# Create .gitignore

```bash
touch ../.gigignore
```

---

# .gitignore

```gitignore
server/node_modules
server/corevage
server/dist
server/.env
```

---

# Install Development dependencies

```bash
npm install -D @babel/cli@7.14.8 -E
npm install -D @babel/core@7.15.0 -E
npm install -D @babel/node@7.14.9 -E
npm install -D @babel/preset-env@7.15.0 -E
npm install -D jest@27.0.6 -E
npm install -D @types/jest@27.0.0 -E
npm install -D supertest@6.1.4 -E
npm install -D nodemon@2.0.12 -E

```

---

# Install Production Dependencies

```bash
npm install -P bcrypt@5.0.1 -E
npm install -P sequelize@6.6.5 -E
npm install -P sequelize-cli@6.2.0 -E
npm install -P jsonwebtoken@8.5.1 -E
npm install -P pg@8.7.1 -E
npm install -P express@4.17.1 -E
npm install -P dotenv@10.0.0 -E
npm install -P morgan@1.10.0 -E # optional
npm install -P cls-hooked@4.2.2 -E
```

---

# Create babel and jest config file

```bash
touch babel.config.js
touch jest.config.js
```

---

# babel.config.js

```javascript
module.exports = {
	presets: [['@babel/preset-env',{targets:{node:'current'}}]]
}
```

---

# jest.config.js

```javascript
module.exports = {
	presets: [['@babel/preset-env',{targets:{node:'current'}}]]
}
```

---

# In package.json, add these scripts

```json
"scripts": {
  // EXECUTION SCRIPTS 
  "build": "babel ./src --out-dir ./dist",
  "start": "node dist/server.js",

  // Allows debug in chrome developer tools
  "debug": "npm run dev -- --inspect",
  "dev": "NODE_ENV=development nodemon --exec babel-node src/server.js",

  // TEST SCRIPTS
  "test": "jest --runInBand",

  // It is equivalent to
  // jest --runInBand --watch
  "test:watch": "npm test -- --watch",

  // It is equivalent to
  // jest --runInBand --coverage
  "test:coverage": "npm test -- --coverage"
}
```

---

# Conecting to the database

```bash
# in root
touch docker-compose.yaml
touch .env
```

---

# docker-compose.yaml

```yaml
version: '3'
services:
  postgres:
    image: postgres:13
    container_name: sequelize-course-db
    env_file:
      - .env
    environment:
      POSTGRES_PASSWORD: $(DB_PASSWORD:-postgres)
    ports:
      - $(DB_PORT:-5432):5432
  postgres-test:
    image: postgres:13
    container_name: sequelize-course-test-db
    env_file:
      - .env
    environment:
      POSTGRES_PASSWORD: $(DB_TEST_PASSWORD:-postgres)
    ports:
      - $(DB_TEST_PORT:-5433):5432
```

---

# .env

```console
DB_TEST_PASSWORD='test'
DB_TEST_PORT='5433'
```

---

# Execute the docker compose file

```bash
# Avoid port conflicts
sudo systemctl stop postgresql@13-main.service
sudo systemctl stop postgresql.service

sudo systemctl status postgresql@13-main.service
sudo systemctl status postgresql.service

sudo docker-compose up -d
```

---

# Conect to main database in dbeaver

```txt
host: localhost
port: 5432
databse: postgres
username: postgres
password: postgres

Note: Change General > Connection name to "sequelize_course_main_db"
```

---

# Conect to test database in dbeaver

```txt
host: localhost
port: 5433
databse: postgres
username: postgres
password: test

Note: Change General > Connection name to "sequelize_course_test_db"
```

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