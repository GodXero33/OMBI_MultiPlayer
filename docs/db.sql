DROP DATABASE IF EXISTS ombi_multiplayer;
CREATE DATABASE ombi_multiplayer;
USE ombi_multiplayer;

CREATE TABLE player (
	id BIGINT AUTO_INCREMENT,
	player_id VARCHAR(255) NOT NULL UNIQUE,
	player_name VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE,
	is_deleted BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id)
);

CREATE TABLE player_profile (
	player_id BIGINT,
	score INT DEFAULT 0,
	games_played INT DEFAULT 0,
	wins INT DEFAULT 0,
	losses INT DEFAULT 0,
	last_login DATETIME,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	is_deleted BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (player_id),
	FOREIGN KEY (player_id) REFERENCES player(id)
);

CREATE TABLE player_friend (
	player1_id BIGINT,
	player2_id BIGINT,
	PRIMARY KEY (player1_id, player2_id),
	FOREIGN KEY (player1_id) REFERENCES player(id),
	FOREIGN KEY (player2_id) REFERENCES player(id)
);

DESC player;
DESC player_profile;
DESC player_friend;

INSERT INTO player (player_id, player_name, password, email, is_deleted) VALUES
('XJ7PQLA29D', 'PlayerOne', 'pass1234', 'playerone@example.com', FALSE),
('N8G5TZWMKX', 'GamerKing', 'securepwd', 'gamerking@example.com', FALSE),
('Y2V9DXRTQW', 'ShadowFox', 'hunter2', 'shadowfox@example.com', FALSE),
('B4L6MNZPQA', 'FireBlaze', 'mypassword', 'fireblaze@example.com', FALSE),
('K7XPZQW8LM', 'IceHunter', 'letmein12', 'icehunter@example.com', FALSE),
('QWLN7X5ZVD', 'StormRider', '123qweasd', 'stormrider@example.com', FALSE),
('ZMP38WLNYX', 'CyberWolf', 'wolfpack99', 'cyberwolf@example.com', FALSE),
('TQXZL9WM28', 'RogueNinja', 'ninjapass', 'rogue@example.com', FALSE),
('VWPMX8L72Q', 'ThunderGod', 'mortal123', 'thundergod@example.com', FALSE),
('A9KXQWLMP7', 'SilentKill', 'silentshadow', 'silentkiller@example.com', FALSE),
('MZXQ8WLN5T', 'NightHawk', 'darksky23', 'nighthawk@example.com', FALSE),
('WPLN9QX7ZM', 'FrostByte', 'freeze99', 'frostbyte@example.com', FALSE),
('YXQLMP782W', 'VenomClaw', 'spiderman', 'venomclaw@example.com', FALSE),
('PQMZXLW872', 'DoomSlayer', 'ripandtear', 'doomslayer@example.com', FALSE),
('KLX9QMPWT8', 'StealthFox', 'sneakyone', 'stealthfox@example.com', FALSE),
('ZPQWLX87MT', 'PhantomAce', 'phantom123', 'phantomace@example.com', FALSE),
('N8XWLQMPZ3', 'BlazeHawk', 'blazingfire', 'blazehawk@example.com', FALSE),
('XQMPZL9WT7', 'CyberNeko', 'nekopower1', 'cyberneko@example.com', FALSE),
('MPXLQWN9T8', 'GhostRider', 'hellfire66', 'ghostrider@example.com', FALSE),
('LQMPZX8WT9', 'StormFury', 'thunder99', 'stormfury@example.com', FALSE),
('PWLXQMN87Z', 'ShadowNeko', 'darkmeow', 'shadowneko@example.com', FALSE),
('XLMPZQW87T', 'CodeMaster', 'codingisfun', 'codemaster@example.com', FALSE),
('MZPXWQLN78', 'ZeroKnight', 'knightfall', 'zeroknight@example.com', FALSE),
('QWZPLMX78T', 'SkyWalker', 'forcepower', 'skywalker@example.com', FALSE),
('NXQZMPWL87', 'NeonTiger', 'brightclaw', 'neontiger@example.com', FALSE),
('LMPZXWQ89T', 'InfernoX', 'hotfire77', 'infernox@example.com', FALSE),
('PQWLXMN98Z', 'SilverWolf', 'lunarhowl', 'silverwolf@example.com', FALSE),
('MPXLQWN78Z', 'DarkRaven', 'nevermore', 'darkraven@example.com', FALSE),
('WLXQMPZ87N', 'DragonLord', 'dracarys88', 'dragonlord@example.com', FALSE),
('PXWZQLM87N', 'WarMachine', 'ironman99', 'warmachine@example.com', FALSE);

INSERT INTO player_profile (player_id, score, games_played, wins, losses, last_login, is_deleted) 
SELECT id, 0, 0, 0, 0, NOW(), FALSE
FROM player;

INSERT INTO player_friend (player1_id, player2_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 4),
(3, 1),
(3, 5),
(4, 2),
(4, 6),
(5, 3),
(5, 7),
(6, 4),
(6, 8),
(7, 5),
(7, 9),
(8, 6),
(8, 10),
(9, 7),
(9, 11),
(10, 8),
(10, 12),
(11, 9),
(11, 13),
(12, 10),
(12, 14),
(13, 11),
(13, 15),
(14, 12),
(14, 16),
(15, 13),
(15, 17),
(16, 14),
(16, 18),
(17, 15),
(17, 19),
(18, 16),
(18, 20),
(19, 17),
(19, 21),
(20, 18),
(20, 22),
(21, 19),
(21, 23),
(22, 20),
(22, 24),
(23, 21),
(23, 25),
(24, 22),
(24, 26),
(25, 23),
(25, 27),
(26, 24),
(26, 28),
(27, 25),
(27, 29),
(28, 26),
(28, 30),
(29, 27),
(29, 1),
(30, 28),
(30, 2);

INSERT INTO player_friend (player1_id, player2_id)
SELECT 2, 30
WHERE NOT EXISTS (
    SELECT 30 FROM player_friend WHERE (player1_id = 30 AND player2_id = 2) OR (player1_id = 2 AND player2_id = 30)
);

SELECT * FROM player;
SELECT * FROM player_profile;
SELECT * FROM player_friend;
