package dev.shan.ombi.repository.custom;

import dev.shan.ombi.dto.PlayerProfile;
import dev.shan.ombi.entity.PlayerProfileEntity;
import dev.shan.ombi.repository.CrudRepository;

public interface PlayerProfileRepository extends CrudRepository<String, PlayerProfileEntity> {
}
