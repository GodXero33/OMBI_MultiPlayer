DROP DATABASE IF EXISTS ombi_multiplayer;
CREATE DATABASE ombi_multiplayer;
USE ombi_multiplayer;

CREATE TABLE player (
	id INT AUTO_INCREMENT,
	player_id VARCHAR(255) NOT NULL UNIQUE,
	player_name VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE,
	is_deleted BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id)
);

DESC player;
