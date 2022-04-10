# Introduction to sequelize orm with express and postgres

# About this course

- If you have worked with relational databases, then I want to introduce you to them.

- In a Job, you are most likely to work with a ORM (Object Relational Mapper) to handle things like queries, insertions, etc.

- If you have worked with relational databases and worked with an ORM like ActiveRecord for Ruby, then this is to show how Sequelize can be.

- I want to show you a pattern I use for my projects.

- Especially, I want to show you how may pattern allows for easy testing.

- This brings us to the next point

- I want to show you how to test a Node.js app with Jest and supertest!

- "Untested coede is broken code".

# What we are going to build ?

- A simple authentication backend which is going to have:

```console
Login
Logout
Refresh tokens
Access tokens
Register
```
# What we are going to learn ?

```console
JWT (aren't the focus)
Sequelize
Testing
Express.js
Docker
Best practices!
```

# Tools

- Avoid Windows

- Use Linux, WSL, or a Linux distro alongside Windows

- Update, and install curl and snap

```bash
sudo apt update

sudo apt install curl

sudo apt install snapd
```

- Node Version Manager (nvm)

```bash
# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04-pt
# https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/

curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

source ~/.profile

nvm --version
```

- Node
```bash
# -> install the lts node version
# I will use the 14.17.2 to avoid conflicts
# Indeed, this tutorial is about the last LTS version: 16.14.2

# way 01
nvm install --lts

# way 02
nvm install 16.14.2

nvm list

nvm current

# ->Use nvm version
# The course node is 14.17.1
# This is the current LTS version at the time i was coding

nvm use 16.14.2 
```

- Docker and Docker Compose

```bash
# Docker version 20.10.11, build dea9396 
# docker-compose version 1.26.0, build d4451659 

# Install from some both digital ocean or official docker page
```

- Postman

```bash
sudo snap install postman
```

- DBeaver

```bash
sudo snap install dbeaver-ce
```