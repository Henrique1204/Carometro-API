CREATE DATABASE  IF NOT EXISTS carometro;
USE carometro;

DROP TABLE IF EXISTS alunos;
CREATE TABLE alunos (
	id int NOT NULL AUTO_INCREMENT,
	nome varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	telefone varchar(255) NOT NULL,
	data_nascimento datetime NOT NULL,
	foto varchar(255) NOT NULL,
	id_turma int NOT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS cursos;
CREATE TABLE cursos (
	id int NOT NULL AUTO_INCREMENT,
	nome varchar(255) NOT NULL,
	periodo varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS ocorrencias;
CREATE TABLE ocorrencias (
	id int NOT NULL AUTO_INCREMENT,
	data_criacao datetime NOT NULL,
	titulo varchar(255) NOT NULL,
	conteudo varchar(255) NOT NULL,
	criado_por varchar(255) NOT NULL,
	id_aluno int NOT NULL,
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS turmas;
CREATE TABLE turmas (
	id int NOT NULL AUTO_INCREMENT,
	nome varchar(255) NOT NULL,
	id_curso int NOT NULL,
	formado tinyint(1) NOT NULL,
	PRIMARY KEY (id)
);

CREATE USER IF NOT EXISTS 'carometro'@'localhost' IDENTIFIED BY 'senai115';
GRANT ALL PRIVILEGES ON * . * TO 'carometro'@'localhost';
FLUSH PRIVILEGES;