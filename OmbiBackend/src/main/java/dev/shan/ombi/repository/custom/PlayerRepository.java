package dev.shan.ombi.repository.custom;

import dev.shan.ombi.entity.PlayerEntity;
import dev.shan.ombi.repository.CrudRepository;

public interface PlayerRepository extends CrudRepository<PlayerEntity> {
	PlayerEntity getByPlayerId (String playerId);
	boolean deleteByPlayerId (String playerId);
}
