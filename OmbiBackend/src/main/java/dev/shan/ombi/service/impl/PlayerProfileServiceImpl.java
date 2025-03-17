package dev.shan.ombi.service.impl;

import dev.shan.ombi.dto.PlayerProfile;
import dev.shan.ombi.entity.PlayerProfileEntity;
import dev.shan.ombi.repository.custom.PlayerProfileRepository;
import dev.shan.ombi.service.PlayerProfileService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class PlayerProfileServiceImpl implements PlayerProfileService {
	private final PlayerProfileRepository playerProfileRepository;
	private final ModelMapper modelMapper;

	@Override
	public PlayerProfile get (String playerId) {
		final PlayerProfileEntity playerProfileEntity = this.playerProfileRepository.get(playerId);
		return playerProfileEntity == null ? null : this.modelMapper.map(playerProfileEntity, PlayerProfile.class);
	}

	@Override
	public List<PlayerProfile> getAll () {
		final List<PlayerProfileEntity> playerProfileEntities = this.playerProfileRepository.getAll();

		if (playerProfileEntities == null) return null;

		final List<PlayerProfile> playerProfiles = new ArrayList<>();

		playerProfileEntities.forEach(playerProfileEntity -> playerProfiles.add(this.modelMapper.map(playerProfileEntity, PlayerProfile.class)));

		return playerProfiles;
	}
}
