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
import java.util.*;

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
	public boolean delete (String id) {
		return false;
	}

	private List<PlayerProfileFriendEntity> getPlayerProfileFriendEntities (String playerId) throws SQLException {
		final ResultSet playerFriendsResultSet = CrudUtil.execute("SELECT player1_id, player2_id FROM player_friend WHERE player1_id = ? OR player2_id = ?", playerId, playerId);
		final Set<String> friendIdsSet = new HashSet<>();
		final List<PlayerProfileFriendEntity> playerProfileFriendEntities = new ArrayList<>();

		while (playerFriendsResultSet.next()) {
			final String friend1Id = playerFriendsResultSet.getString(1);
			final String friend2Id = playerFriendsResultSet.getString(2);
			final String friendId = friend1Id.equals(playerId) ? friend2Id : friend1Id;

			if (!friendIdsSet.add(friendId)) continue;

			final ResultSet playerFriendNameResultSet = CrudUtil.execute("SELECT id, name FROM player WHERE is_deleted = FALSE AND id = ?", friendId);

			if (playerFriendNameResultSet.next()) playerProfileFriendEntities.add(PlayerProfileFriendEntity.builder().
				playerId(playerFriendNameResultSet.getString(1)).
				playerName(playerFriendNameResultSet.getString(2)).
				build());
		}

		return playerProfileFriendEntities;
	}

	private List<Map<String, String>> getPlayerProfileRewords (String playerId) throws SQLException {
		final ResultSet playerProfileRewordsResultSet = CrudUtil.execute("SELECT r.name, r.description FROM reword r JOIN player_reword pr ON r.id = pr.reword_id WHERE pr.player_id = ?", playerId);
		final List<Map<String, String>> rewordList = new ArrayList<>();

		while (playerProfileRewordsResultSet.next()) {
			final Map<String, String> playerRewordMap = new HashMap<>();

			playerRewordMap.put("name", playerProfileRewordsResultSet.getString(1));
			playerRewordMap.put("description", playerProfileRewordsResultSet.getString(2));
			rewordList.add(playerRewordMap);
		}

		return rewordList;
	}

	@Override
	public PlayerProfileEntity get (String id) {
		try {
			final ResultSet playerProfileResultSet = CrudUtil.execute("SELECT p.name, pp.score, pp.games_played, pp.wins, pp.losses, pp.last_login, pp.created_at, pp.updated_at FROM player_profile pp JOIN player p ON pp.player_id = p.id WHERE pp.is_deleted = FALSE AND pp.player_id = ?", id);

			if (!playerProfileResultSet.next()) throw new SQLException("Failed to retrieve player profile details.");

			final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			final PlayerProfileEntity playerProfileEntity = PlayerProfileEntity.builder().
				playerId(id).
				playerName(playerProfileResultSet.getString(1)).
				score(playerProfileResultSet.getLong(2)).
				gamesPlayed(playerProfileResultSet.getInt(3)).
				wins(playerProfileResultSet.getInt(4)).
				losses(playerProfileResultSet.getInt(5)).
				lastLogin(LocalDateTime.parse(playerProfileResultSet.getString(6), formatter)).
				createdAt(LocalDateTime.parse(playerProfileResultSet.getString(7), formatter)).
				updatedAt(LocalDateTime.parse(playerProfileResultSet.getString(8), formatter)).
				build();

			playerProfileEntity.setFriends(this.getPlayerProfileFriendEntities(id));
			playerProfileEntity.setRewords(this.getPlayerProfileRewords(id));

			return playerProfileEntity;
		} catch (SQLException exception) {
			System.out.println(exception.getMessage());
			return null;
		}
	}

	@Override
	public List<PlayerProfileEntity> getAll () {
		return List.of();
	}
}
