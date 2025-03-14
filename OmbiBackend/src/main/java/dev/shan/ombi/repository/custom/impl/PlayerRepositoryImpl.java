package dev.shan.ombi.repository.custom.impl;

import dev.shan.ombi.entity.PlayerEntity;
import dev.shan.ombi.repository.custom.PlayerRepository;
import dev.shan.ombi.util.CrudUtil;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class PlayerRepositoryImpl implements PlayerRepository {
	@Override
	public PlayerEntity add (PlayerEntity entity) {
		try {
			final long generatedId = CrudUtil.executeWithGeneratedKeys(
				"INSERT INTO player (player_id, player_name, password, email) VALUES (?, ?, ?, ?)",
				entity.getPlayerId(),
				entity.getPlayerName(),
				entity.getPassword(),
				entity.getEmail()
			);

			if (generatedId == 0) throw new SQLException("Failed to insert player record.");

			entity.setId(generatedId);
			return entity;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}

	@Override
	public PlayerEntity update (PlayerEntity entity) {
		try {
			return (Integer) CrudUtil.execute(
				"UPDATE player SET player_name = ?, password = ?, email = ? WHERE is_deleted = FALSE",
				entity.getPlayerName(),
				entity.getPassword(),
				entity.getEmail()
			) == 1 ? entity : null;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}

	private boolean deletedByFieldName (String fieldName, Object identifier) {
		try {
			return (Integer) CrudUtil.execute("UPDATE player SET is_deleted = TRUE WHERE is_deleted = FALSE AND " + fieldName + " = ?", identifier) == 1;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return false;
		}
	}

	@Override
	public boolean delete (Long id) {
		return this.deletedByFieldName("id", id);
	}

	private PlayerEntity getByFieldName (String filedName, Object identifier) {
		try {
			final ResultSet resultSet = CrudUtil.execute("SELECT id, player_id, player_name, password, email FROM player WHERE is_deleted = FALSE AND " + filedName + " = ?", identifier);

			if (resultSet.next()) return PlayerEntity.builder().
				id(resultSet.getLong(1)).
				playerId(resultSet.getString(2)).
				playerName(resultSet.getString(3)).
				password(resultSet.getString(4)).
				email(resultSet.getString(5)).
				build();

			return null;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}
	@Override
	public PlayerEntity get (Long id) {
		return this.getByFieldName("id", id);
	}

	@Override
	public List<PlayerEntity> getAll () {
		try {
			final List<PlayerEntity> playerEntities = new ArrayList<>();
			final ResultSet resultSet = CrudUtil.execute("SELECT id, player_id, player_name, password, email FROM player WHERE is_deleted = FALSE");

			while (resultSet.next()) playerEntities.add(PlayerEntity.builder().
				id(resultSet.getLong(1)).
				playerId(resultSet.getString(2)).
				playerName(resultSet.getString(3)).
				password(resultSet.getString(4)).
				email(resultSet.getString(5)).
				build());

			return playerEntities;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}

	@Override
	public PlayerEntity getByPlayerId (String playerId) {
		return this.getByFieldName("player_id", playerId);
	}

	@Override
	public boolean deleteByPlayerId (String playerId) {
		return this.deletedByFieldName("player_id", playerId);
	}
}
