package dev.shan.ombi.controller;

import dev.shan.ombi.dto.Player;
import dev.shan.ombi.response.PlayerResponse;
import dev.shan.ombi.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/player")
public class PlayerController {
	private final PlayerService playerService;

	@GetMapping("get/{player_id}")
	public PlayerResponse<Player> get (@PathVariable("player_id") String playerId) {
		final Player player = this.playerService.getByPlayerId(playerId);
		return player == null ? new PlayerResponse<>(HttpStatus.NOT_FOUND, "Player not found with player id: " + playerId, null) : new PlayerResponse<>(HttpStatus.OK, "Player found with player id: " + playerId, player);
	}

	@GetMapping("get-all")
	public PlayerResponse<List<Player>> getAll () {
		final List<Player> players = this.playerService.getAll();
		return players == null ? new PlayerResponse<>(HttpStatus.NOT_FOUND, "Failed to load players", List.of()) : new PlayerResponse<>(HttpStatus.OK, "All players loaded", players);
	}

	@PostMapping("add")
	public PlayerResponse<Player> add (@RequestBody Player player) {
		final Player addedPlayer = this.playerService.add(player);
		return addedPlayer == null ? new PlayerResponse<>(HttpStatus.NOT_MODIFIED, "Player not added", null) : new PlayerResponse<>(HttpStatus.OK, "Player added", addedPlayer);
	}

	@PutMapping("update")
	public PlayerResponse<Player> update (@RequestBody Player player) {
		if (player.getId() == null) return new PlayerResponse<>(HttpStatus.BAD_REQUEST, "Provided player has no id", player);

		final Player updatedPlayer = this.playerService.update(player);

		return updatedPlayer == null ? new PlayerResponse<>(HttpStatus.NOT_MODIFIED, "Player not updated", null) : new PlayerResponse<>(HttpStatus.OK, "Player updated", updatedPlayer);
	}

	@DeleteMapping("delete/{player_id}")
	public PlayerResponse<?> delete (@PathVariable("player_id") String playerId) {
		return this.playerService.delete(playerId) ? new PlayerResponse<>(HttpStatus.OK, "Player deleted with player id: " + playerId, playerId) : new PlayerResponse<>(HttpStatus.NOT_MODIFIED, "Player delete failed with player id: " + playerId, playerId);
	}
}
