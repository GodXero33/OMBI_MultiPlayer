package dev.shan.ombi.controller;

import dev.shan.ombi.dto.PlayerProfile;
import dev.shan.ombi.response.PlayerProfileResponse;
import dev.shan.ombi.service.PlayerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/player-profile")
public class PlayerProfileController {
	private final PlayerProfileService playerProfileService;

	@GetMapping("/get/{player_id}")
	public PlayerProfileResponse<PlayerProfile> get (@PathVariable("player_id") String playerId) {
		final PlayerProfile playerProfile = this.playerProfileService.get(playerId);
		return playerProfile == null ? new PlayerProfileResponse<>(HttpStatus.NOT_FOUND, "Player profile not found with player id: " + playerId, null) : new PlayerProfileResponse<>(HttpStatus.OK, "Player profile found with player id: " + playerId, playerProfile);
	}

	@GetMapping("/get-all")
	public PlayerProfileResponse<List<PlayerProfile>> getAll () {
		final List<PlayerProfile> playerProfiles = this.playerProfileService.getAll();
		return playerProfiles == null ? new PlayerProfileResponse<>(HttpStatus.NOT_FOUND, "Failed to load player profiles", List.of()) : new PlayerProfileResponse<>(HttpStatus.OK, "All player profiles are loaded", playerProfiles);
	}
}
