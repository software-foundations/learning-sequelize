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

