package dev.shan.ombi.repository.custom.impl;

import dev.shan.ombi.entity.PlayerProfileEntity;
import dev.shan.ombi.repository.custom.PlayerProfileRepository;
import dev.shan.ombi.util.DBConnection;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class PlayerProfileRepositoryImpl implements PlayerProfileRepository {
	private final Connection connection;

	public PlayerProfileRepositoryImpl () throws SQLException {
		this.connection = DBConnection.getInstance().getConnection();
	}

	@Override
	public PlayerProfileEntity add (PlayerProfileEntity entity) {
		return null;
	}

	@Override
	public PlayerProfileEntity update (PlayerProfileEntity entity) {
		return null;
	}

	@Override
	public boolean delete (Long id) {
		return false;
	}

	@Override
	public PlayerProfileEntity get (Long id) {
		return null;
	}

	@Override
	public List<PlayerProfileEntity> getAll () {
		return List.of();
	}
}
