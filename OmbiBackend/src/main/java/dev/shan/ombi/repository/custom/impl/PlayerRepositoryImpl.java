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

			if ((Integer) CrudUtil.execute(
				"INSERT INTO player (id, name, password, email) VALUES (?, ?, ?, ?)",
				entity.getId(),
				entity.getName(),
				entity.getPassword(),
				entity.getEmail()
			) == 0) throw new SQLException("Failed to insert player record.");

			if ((Integer) CrudUtil.execute("INSERT INTO player_profile (player_id, score, games_played, wins, losses, last_login) VALUES (?, 0, 0, 0, 0, NOW())", entity.getId()) != 1) throw new SQLException("Failed to insert player profile record.");

			this.connection.commit();
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
				"UPDATE player SET name = ?, password = ?, email = ? WHERE is_deleted = FALSE AND id = ?",
				entity.getName(),
				entity.getPassword(),
				entity.getEmail(),
				entity.getId()
			) == 1 ? entity : null;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}

	@Override
	public boolean delete (String id) {
		try {
			this.connection.setAutoCommit(false);

			if ((Integer) CrudUtil.execute("UPDATE player SET is_deleted = TRUE WHERE is_deleted = FALSE AND id = ?", id) == 0) {
				System.out.println("Player not found to delete.");
				return true;
			}

			if ((Integer) CrudUtil.execute("UPDATE player_profile SET is_deleted = TRUE WHERE is_deleted = FALSE AND player_id = ?", id) == 0) {
				System.out.println("Failed to delete player profile: " + id);
				return false;
			}

			if ((Integer) CrudUtil.execute("DELETE FROM player_friend WHERE player1_id = ? OR player2_id = ?", id, id) == 0) {
				System.out.println("Failed to delete friends of player: " + id);
				return false;
			}

			if ((Integer) CrudUtil.execute("UPDATE player_reword SET is_deleted = TRUE WHERE is_deleted = FALSE AND player_id = ?", id) == 0) {
				System.out.println("Failed to delete rewords of player: " + id);
				return false;
			}

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
	public PlayerEntity get (String id) {
		try {
			final ResultSet resultSet = CrudUtil.execute("SELECT name, password, email FROM player WHERE is_deleted = FALSE AND id = ?", id);

			if (resultSet.next()) return PlayerEntity.builder().
				id(id).
				name(resultSet.getString(1)).
				password(resultSet.getString(2)).
				email(resultSet.getString(3)).
				build();

			return null;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}

	@Override
	public List<PlayerEntity> getAll () {
		try {
			final List<PlayerEntity> playerEntities = new ArrayList<>();
			final ResultSet resultSet = CrudUtil.execute("SELECT id, name, password, email FROM player WHERE is_deleted = FALSE");

			while (resultSet.next()) playerEntities.add(PlayerEntity.builder().
				id(resultSet.getString(1)).
				name(resultSet.getString(2)).
				password(resultSet.getString(3)).
				email(resultSet.getString(4)).
				build());

			return playerEntities;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}
}
