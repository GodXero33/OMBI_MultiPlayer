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

SELECT * FROM player;
