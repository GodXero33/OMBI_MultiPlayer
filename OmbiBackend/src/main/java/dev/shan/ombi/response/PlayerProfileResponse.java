package dev.shan.ombi.response;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class PlayerProfileResponse<T> extends ResponseEntity<Map<String, Object>> {
	public PlayerProfileResponse (HttpStatusCode statusCode, String message, T data) {
		super(PlayerProfileResponse.createResponse(message, data), statusCode);
	}

	private static <T> Map<String, Object> createResponse (String message, T data) {
		final Map<String, Object> response = new HashMap<>();

		response.put("message", message);
		response.put("data", data);

		return response;
	}
}
