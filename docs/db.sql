DROP DATABASE IF EXISTS ombi_multiplayer;
CREATE DATABASE ombi_multiplayer;
USE ombi_multiplayer;

CREATE TABLE player (
	id VARCHAR(255),
	name VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE,
	is_deleted BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id)
);

CREATE TABLE player_profile (
	player_id VARCHAR(255),
	score BIGINT DEFAULT 0,
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
	player1_id VARCHAR(255),
	player2_id VARCHAR(255),
	PRIMARY KEY (player1_id, player2_id),
	FOREIGN KEY (player1_id) REFERENCES player(id),
	FOREIGN KEY (player2_id) REFERENCES player(id)
);

CREATE TABLE reword (
	id INT AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL UNIQUE,
	description VARCHAR(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE player_reword (
	player_id VARCHAR(255),
	reword_id INT,
	is_deleted BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (player_id, reword_id),
	FOREIGN KEY (player_id) REFERENCES player(id),
	FOREIGN KEY (reword_id) REFERENCES reword(id)
);

DESC player;
DESC player_profile;
DESC player_friend;
DESC reword;
DESC player_reword;

INSERT INTO player (id, name, password, email, is_deleted) VALUES
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
('XJ7PQLA29D', 'N8G5TZWMKX'),
('XJ7PQLA29D', 'Y2V9DXRTQW'),
('N8G5TZWMKX', 'B4L6MNZPQA'),
('Y2V9DXRTQW', 'K7XPZQW8LM'),
('B4L6MNZPQA', 'QWLN7X5ZVD'),
('K7XPZQW8LM', 'ZMP38WLNYX'),
('QWLN7X5ZVD', 'TQXZL9WM28'),
('ZMP38WLNYX', 'VWPMX8L72Q'),
('TQXZL9WM28', 'A9KXQWLMP7'),
('VWPMX8L72Q', 'MZXQ8WLN5T'),
('A9KXQWLMP7', 'WPLN9QX7ZM'),
('MZXQ8WLN5T', 'YXQLMP782W'),
('WPLN9QX7ZM', 'PQMZXLW872'),
('YXQLMP782W', 'KLX9QMPWT8'),
('PQMZXLW872', 'ZPQWLX87MT'),
('KLX9QMPWT8', 'N8XWLQMPZ3'),
('ZPQWLX87MT', 'XQMPZL9WT7'),
('N8XWLQMPZ3', 'MPXLQWN9T8'),
('XQMPZL9WT7', 'LQMPZX8WT9'),
('MPXLQWN9T8', 'PWLXQMN87Z'),
('LQMPZX8WT9', 'XLMPZQW87T'),
('PWLXQMN87Z', 'MZPXWQLN78'),
('XLMPZQW87T', 'QWZPLMX78T'),
('MZPXWQLN78', 'NXQZMPWL87'),
('QWZPLMX78T', 'LMPZXWQ89T'),
('NXQZMPWL87', 'PQWLXMN98Z'),
('LMPZXWQ89T', 'MPXLQWN78Z'),
('PQWLXMN98Z', 'WLXQMPZ87N'),
('MPXLQWN78Z', 'PXWZQLM87N'),
('PXWZQLM87N', 'N8G5TZWMKX');

INSERT INTO player_friend (player1_id, player2_id)
SELECT 'N8G5TZWMKX', 'PXWZQLM87N'
WHERE NOT EXISTS (
    SELECT 1 FROM player_friend 
    WHERE (player1_id = 'N8G5TZWMKX' AND player2_id = 'PXWZQLM87N') 
       OR (player1_id = 'PXWZQLM87N' AND player2_id = 'N8G5TZWMKX')
);

INSERT INTO reword (name, description) VALUES
('First Victory', 'Awarded for winning your first game.'),
('Card Master', 'Earned for playing 100 cards in total.'),
('Comeback King', 'Win a game after having less than 10% of your initial points.'),
('Unbeatable Streak', 'Achieve a winning streak of 5 games.'),
('Strategic Genius', 'Win a game using only strategic card plays without relying on luck.');

INSERT INTO player_reword (player_id, reword_id) VALUES
('XJ7PQLA29D', 1),
('XJ7PQLA29D', 2),
('N8G5TZWMKX', 3),
('N8G5TZWMKX', 4),
('Y2V9DXRTQW', 5),
('Y2V9DXRTQW', 1),
('B4L6MNZPQA', 2),
('B4L6MNZPQA', 3),
('K7XPZQW8LM', 4),
('K7XPZQW8LM', 5),
('QWLN7X5ZVD', 1),
('QWLN7X5ZVD', 2),
('ZMP38WLNYX', 3),
('ZMP38WLNYX', 4),
('TQXZL9WM28', 5),
('TQXZL9WM28', 1),
('VWPMX8L72Q', 2),
('VWPMX8L72Q', 3),
('A9KXQWLMP7', 4),
('A9KXQWLMP7', 5),
('MZXQ8WLN5T', 1),
('MZXQ8WLN5T', 2),
('WPLN9QX7ZM', 3),
('WPLN9QX7ZM', 4),
('YXQLMP782W', 5),
('YXQLMP782W', 1),
('PQMZXLW872', 2),
('PQMZXLW872', 3),
('KLX9QMPWT8', 4),
('KLX9QMPWT8', 5),
('ZPQWLX87MT', 1),
('ZPQWLX87MT', 2),
('N8XWLQMPZ3', 3),
('N8XWLQMPZ3', 4),
('XQMPZL9WT7', 5),
('XQMPZL9WT7', 1),
('MPXLQWN9T8', 2),
('MPXLQWN9T8', 3),
('LQMPZX8WT9', 4),
('LQMPZX8WT9', 5),
('PWLXQMN87Z', 1),
('PWLXQMN87Z', 2),
('XLMPZQW87T', 3),
('XLMPZQW87T', 4),
('MZPXWQLN78', 5),
('MZPXWQLN78', 1),
('QWZPLMX78T', 2),
('QWZPLMX78T', 3),
('NXQZMPWL87', 4),
('NXQZMPWL87', 5),
('LMPZXWQ89T', 1),
('LMPZXWQ89T', 2),
('PQWLXMN98Z', 3),
('PQWLXMN98Z', 4),
('MPXLQWN78Z', 5),
('MPXLQWN78Z', 1),
('WLXQMPZ87N', 2),
('WLXQMPZ87N', 3),
('PXWZQLM87N', 4),
('PXWZQLM87N', 5);

SELECT * FROM player;
SELECT * FROM player_profile;
SELECT * FROM player_friend;
SELECT * FROM reword;
SELECT * FROM player_reword;

SELECT r.name, r.description FROM reword r JOIN player_reword pr ON r.id = pr.reword_id WHERE pr.player_id = 'PXWZQLM87N';
