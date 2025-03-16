package dev.shan.ombi.repository.custom.impl;

import dev.shan.ombi.entity.PlayerEntity;
import dev.shan.ombi.repository.custom.PlayerRepository;
import dev.shan.ombi.util.CrudUtil;
import dev.shan.ombi.util.DBConnection;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class PlayerRepositoryImpl implements PlayerRepository {
	private final Connection connection;

	public PlayerRepositoryImpl () throws SQLException {
		this.connection = DBConnection.getInstance().getConnection();
	}

	@Override
	public PlayerEntity add (PlayerEntity entity) {
		try {
			this.connection.setAutoCommit(false);

			final long generatedId = CrudUtil.executeWithGeneratedKeys(
				"INSERT INTO player (player_id, player_name, password, email) VALUES (?, ?, ?, ?)",
				entity.getPlayerId(),
				entity.getPlayerName(),
				entity.getPassword(),
				entity.getEmail()
			);

			if (generatedId == 0) throw new SQLException("Failed to insert player record.");
			if ((Integer) CrudUtil.execute("INSERT INTO player_profile (player_id, score, games_played, wins, losses, last_login) VALUES (?, 0, 0, 0, 0, NOW())", generatedId) != 1) throw new SQLException("Failed to insert player profile record.");

			this.connection.commit();
			entity.setId(generatedId);
			return entity;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());

			try {
				this.connection.rollback();
			} catch (SQLException rollbackException) {
				System.out.println(rollbackException.getMessage());
			}

			return null;
		} finally {
			try {
				this.connection.setAutoCommit(true);
			} catch (SQLException exception) {
				System.out.println(exception.getMessage());
			}
		}
	}

	@Override
	public PlayerEntity update (PlayerEntity entity) {
		try {
			return (Integer) CrudUtil.execute(
				"UPDATE player SET player_name = ?, password = ?, email = ? WHERE is_deleted = FALSE AND id = ?",
				entity.getPlayerName(),
				entity.getPassword(),
				entity.getEmail(),
				entity.getId()
			) == 1 ? entity : null;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}

	private boolean deletedByFieldName (String fieldName, Object identifier) {
		try {
			this.connection.setAutoCommit(false);

			final long id;

			if (fieldName.equals("player_id")) {
				final ResultSet playerIDResultSet = CrudUtil.execute("SELECT id FROM player WHERE is_deleted = FALSE AND " + fieldName + " = ?", identifier);

				if (!playerIDResultSet.next()) throw new SQLException("Failed to retrieve player ID");

				id = playerIDResultSet.getLong(1);
			} else {
				id = (Long) identifier;
			}

			if ((Integer) CrudUtil.execute("UPDATE player SET is_deleted = TRUE WHERE is_deleted = FALSE AND " + fieldName + " = ?", identifier) != 1) throw new SQLException("Failed to update player record.");
			if ((Integer) CrudUtil.execute("UPDATE player_profile SET is_deleted = TRUE WHERE is_deleted = FALSE AND player_id = ?", id) != 1) throw new SQLException("Failed to update player record.");

			this.connection.commit();
			return true;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());

			try {
				this.connection.rollback();
			} catch (SQLException rollbackException) {
				System.out.println(rollbackException.getMessage());
			}

			return false;
		} finally {
			try {
				this.connection.setAutoCommit(true);
			} catch (SQLException exception) {
				System.out.println(exception.getMessage());
			}
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
