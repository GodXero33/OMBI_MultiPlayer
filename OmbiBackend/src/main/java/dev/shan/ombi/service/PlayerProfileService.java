package dev.shan.ombi.service;

import dev.shan.ombi.dto.PlayerProfile;

import java.util.List;

public interface PlayerProfileService {
	PlayerProfile get (String playerId);
	List<PlayerProfile> getAll ();
}
