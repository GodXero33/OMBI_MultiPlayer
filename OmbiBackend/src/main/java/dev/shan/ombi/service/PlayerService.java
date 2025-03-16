package dev.shan.ombi.service;

import dev.shan.ombi.dto.Player;

import java.util.List;

public interface PlayerService {
	Player getByPlayerId (String playerId);
	List<Player> getAll ();
	Player add (Player player);
	Player update (Player player);
	boolean delete (String playerId);
}
