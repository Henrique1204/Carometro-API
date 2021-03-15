CREATE DATABASE  IF NOT EXISTS carometro;
USE carometro;

DROP TABLE IF EXISTS alunos;
CREATE TABLE alunos (
	id int NOT NULL AUTO_INCREMENT,
	nome varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	telefone varchar(255) NOT NULL,
	data_nascimento date NOT NULL,
	foto varchar(255) NOT NULL,
	id_turma int NOT NULL,
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS cursos;
CREATE TABLE cursos (
	id int NOT NULL AUTO_INCREMENT,
	nome varchar(255) NOT NULL,
	periodo varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS ocorrencias;
CREATE TABLE ocorrencias (
	id int NOT NULL AUTO_INCREMENT,
	data_criacao date NOT NULL,
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

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
	id int NOT NULL AUTO_INCREMENT,
	NI varchar(255) NOT NULL,
	nome varchar(255) NOT NULL,
	senha varchar(255) NOT NULL,
	isAdmin tinyint(1) NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO alunos (id, nome, email, telefone, data_nascimento, foto, id_turma) VALUES 
(null, 'Paulo', 'paulo@gmail.com', '11 987654321', '2001-09-20', 'uploads/2021-03-13T03-32-21.591Z-aluno.jpg', 1),
(null, 'Henrique', 'henrique@gmail.com', '11 987654321', '2001-09-20', 'uploads/2021-03-13T03-32-21.591Z-aluno.jpg', 1),
(null, 'Silva', 'silva@gmail.com', '11 987654321', '2001-09-20', 'uploads/2021-03-13T03-32-21.591Z-aluno.jpg', 2);

INSERT INTO cursos (id, nome, periodo) VALUES 
(null, 'Desenvolvimento', 'manhã'),
(null, 'Desenvolvimento', 'tarde');

INSERT INTO ocorrencias (id, data_criacao, titulo, conteudo, criado_por, id_aluno) VALUES 
(null, '2021-03-12', 'Briga com aluno', 'Brigou com um aluno em sala de aula', 'Cláudia', 1),
(null, '2021-03-12', 'Discussão com professor', 'Discutiu com o professor em sala de aula', 'Vieira', 1),
(null, '2021-03-12', 'Briga com aluno', 'Brigou com um aluno em sala de aula', 'Cláudia', 2);

INSERT INTO turmas (id, nome, id_curso, formado) VALUES 
(null, '1DT', 1, 0),
(null, '2DT', 2, 0);

INSERT INTO usuarios (id, NI, nome, senha, isAdmin) VALUES 
(null, "222", "Átila", SHA2("1234", 224), 0),
(null, "333", "Alexandre", SHA2("4321", 224), 1);

CREATE USER IF NOT EXISTS 'carometro'@'localhost' IDENTIFIED BY 'senai115';
GRANT ALL PRIVILEGES ON * . * TO 'carometro'@'localhost';
FLUSH PRIVILEGES;