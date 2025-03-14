package dev.shan.ombi.util;

import java.sql.*;

public class CrudUtil {
	private CrudUtil () {}

	@SuppressWarnings("unchecked")
	public static <T> T execute (String query, Object ...binds) throws SQLException {
		final Connection connection = DBConnection.getInstance().getConnection();
		final PreparedStatement preparedStatement = connection.prepareStatement(query);
		final int bindsLength = binds.length;

		for (int a = 0; a < bindsLength; a++) {
			final Object bind = binds[a];

			if (bind == null) {
				preparedStatement.setNull(a + 1, Types.NULL);
			} else {
				preparedStatement.setObject(a + 1, bind);
			}
		}

		if (query.matches("(?i)^select.*")) return (T) preparedStatement.executeQuery();

		return (T) ((Integer) preparedStatement.executeUpdate());
	}

	public static long executeWithGeneratedKeys (String sql, Object... binds) throws SQLException {
		final PreparedStatement preparedStatement = DBConnection.getInstance().getConnection().prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		final int bindsLength = binds.length;

		for (int a = 0; a < bindsLength; a++) {
			final Object bind = binds[a];

			if (bind == null) {
				preparedStatement.setNull(a + 1, Types.NULL);
			} else {
				preparedStatement.setObject(a + 1, bind);
			}
		}

		final int affectedRows = preparedStatement.executeUpdate();

		if (affectedRows == 0) throw new SQLException("No rows affected.");

		final ResultSet generatedKeys = preparedStatement.getGeneratedKeys();

		if (!generatedKeys.next()) throw new SQLException("No ID obtained.");

		return generatedKeys.getLong(1);
	}
}
