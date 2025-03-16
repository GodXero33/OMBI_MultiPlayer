package dev.shan.ombi.util;

import lombok.Getter;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Getter
public class DBConnection {
	private static DBConnection instance;

	private final Connection connection;

	private DBConnection () throws SQLException {
		final String HOST = "127.0.0.1";
		final int PORT = 3306;
		final String DATABASE = "ombi_multiplayer";
		final String USERNAME = "root";
		final String PASSWORD = "1234";

		this.connection = DriverManager.getConnection(
			String.format(
				"jdbc:mysql://%s:%d/%s",
				HOST,
				PORT,
				DATABASE
			),
			USERNAME,
			PASSWORD
		);
	}

	public static DBConnection getInstance () throws SQLException {
		if (DBConnection.instance == null) DBConnection.instance = new DBConnection();
		return DBConnection.instance;
	}
}
