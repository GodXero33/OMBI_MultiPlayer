package dev.shan.ombi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerProfile {
	private String playerId;
	private String playerName;
	private Long score;
	private Integer gamesPlayed;
	private Integer wins;
	private Integer losses;
	private LocalDateTime lastLogin;
	private List<PlayerProfileFriend> friends;
	private List<Map<String, String>> rewords;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
