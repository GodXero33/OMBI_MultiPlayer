package dev.shan.ombi.service;

import dev.shan.ombi.dto.PlayerProfile;

public interface PlayerProfileService {
	PlayerProfile getByPlayerId (String playerId);
}
