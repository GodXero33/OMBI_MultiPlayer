package dev.shan.ombi.service.impl;

import dev.shan.ombi.dto.Player;
import dev.shan.ombi.entity.PlayerEntity;
import dev.shan.ombi.repository.custom.PlayerRepository;
import dev.shan.ombi.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {
	private final PlayerRepository playerRepository;
	private final ModelMapper modelMapper;

	@Override
	public Player getByPlayerId (String playerId) {
		final PlayerEntity playerEntity = this.playerRepository.getByPlayerId(playerId);
		return playerEntity == null ? null : this.modelMapper.map(playerEntity, Player.class);
	}

	@Override
	public List<Player> getAll () {
		final List<PlayerEntity> playerEntities = this.playerRepository.getAll();

		if (playerEntities == null) return null;

		final List<Player> players = new ArrayList<>();

		playerEntities.forEach(playerEntity -> players.add(this.modelMapper.map(playerEntity, Player.class)));

		return players;
	}

	@Override
	public Player add (Player player) {
		final PlayerEntity addedPlayerEntity = this.playerRepository.add(this.modelMapper.map(player, PlayerEntity.class));
		return addedPlayerEntity == null ? null : this.modelMapper.map(addedPlayerEntity, Player.class);
	}

	@Override
	public Player update (Player player) {
		final PlayerEntity updatedPlayerEntity = this.playerRepository.update(this.modelMapper.map(player, PlayerEntity.class));
		return updatedPlayerEntity == null ? null : this.modelMapper.map(updatedPlayerEntity, Player.class);
	}

	@Override
	public boolean delete (String playerId) {
		return this.playerRepository.deleteByPlayerId(playerId);
	}
}
