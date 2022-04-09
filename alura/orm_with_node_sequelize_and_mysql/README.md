# Sequelize with node and MySql

- We will write an API

- It is for a management system for students and classes of a english school

- Create the database

```bash
# Way 01
sudo -iu root
createdb school -O root
psql -U root
\l
\connect school
\conninfo

# -> way 02

# this
sudo -iu root
psql -U root

# or this
sudo -iu root psql

# create database
CREATE DATABASE shool

\l
\connect school
\conninfo
```

- Create database schema

```sql
create table tbl_person (
	pk_person 	serial 			not null,
	name 		varchar(100) 	not null,
	is_active 	bool 			not null,
	email 		varchar(100) 	not null,
	role 		varchar(100) 	not null,
	primary key (pk_person)
);

create table tbl_level (
	pk_level 	serial 			not null,
	desc_level 	varchar(100) 	not null,
	primary key (pk_level)
);

create table tbl_class (
	pk_class 	serial 			not null,
	fk_teacher 	int,
	fk_level 	int				not null,
	date_start	date 			not null,
	primary key (pk_class),
	foreign key (fk_teacher) 	references tbl_person(pk_person),
	foreign key (fk_level) 		references tbl_level(pk_level)
);

create table tbl_enrollment (
	pk_enrollment	serial 			not null,
	fk_student 		int 			not null,
	fk_class 		int 			not null,
	status 			varchar(100)	not null,
	primary key (pk_enrollment),
	foreign key (fk_student)		references tbl_person(pk_person),
	foreign key (fk_class)			references tbl_class(pk_class)
);
```