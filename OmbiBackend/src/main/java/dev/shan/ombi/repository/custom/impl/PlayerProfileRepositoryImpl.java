package dev.shan.ombi.repository.custom.impl;

import dev.shan.ombi.entity.PlayerProfileEntity;
import dev.shan.ombi.entity.PlayerProfileFriendEntity;
import dev.shan.ombi.repository.custom.PlayerProfileRepository;
import dev.shan.ombi.util.CrudUtil;
import dev.shan.ombi.util.DBConnection;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

	@Override
	public PlayerProfileEntity getByPlayerId (String playerId) {
		try {
			final ResultSet playerIdResultSet = CrudUtil.execute("SELECT id FROM player WHERE is_deleted = FALSE AND player_id = ?", playerId);

			if (!playerIdResultSet.next()) throw new SQLException("Failed to retrieve player's ID from playerID.");

			final long playerMainId = playerIdResultSet.getLong(1);
			final ResultSet playerProfileResultSet = CrudUtil.execute("SELECT score, games_played, wins, losses, last_login, created_at, updated_at FROM player_profile WHERE is_deleted = FALSE AND player_id = ?", playerMainId);

			if (!playerProfileResultSet.next()) throw new SQLException("Failed to retrieve player profile details.");

			final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			final PlayerProfileEntity playerProfileEntity = PlayerProfileEntity.builder().
				id(playerMainId).
				playerId(playerId).
				score(playerProfileResultSet.getLong(1)).
				gamesPlayed(playerProfileResultSet.getInt(2)).
				wins(playerProfileResultSet.getInt(3)).
				losses(playerProfileResultSet.getInt(4)).
				lastLogin(LocalDateTime.parse(playerProfileResultSet.getString(5), formatter)).
				createdAt(LocalDateTime.parse(playerProfileResultSet.getString(6), formatter)).
				updatedAt(LocalDateTime.parse(playerProfileResultSet.getString(7), formatter)).
				build();

			final ResultSet playerFriendsResultSet = CrudUtil.execute("SELECT player1_id, player2_id FROM player_friend WHERE player1_id = ? OR player2_id = ?", playerMainId, playerMainId);
			final Set<Long> friendIdsSet = new HashSet<>();
			final List<PlayerProfileFriendEntity> playerProfileFriendEntities = new ArrayList<>();

			while (playerFriendsResultSet.next()) {
				final long player1Id = playerFriendsResultSet.getLong(1);
				final long player2Id = playerFriendsResultSet.getLong(2);
				final long friendId = player1Id == playerMainId ? player1Id : player2Id;

				if (!friendIdsSet.add(friendId)) continue;

				final ResultSet playerFriendNameResultSet = CrudUtil.execute("SELECT player_id, player_name FROM player WHERE is_deleted = FALSE AND id = ?", friendId);

				if (playerFriendNameResultSet.next()) playerProfileFriendEntities.add(PlayerProfileFriendEntity.builder().
					playerId(playerFriendNameResultSet.getString(1)).
					playerName(playerFriendNameResultSet.getString(2)).
					build());
			}

			playerProfileEntity.setFriends(playerProfileFriendEntities);

			return playerProfileEntity;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}
}
