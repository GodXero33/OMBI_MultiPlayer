package dev.shan.ombi.entity;

import dev.shan.ombi.util.Reword;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerProfileEntity {
	private Long playerId;
	private int score;
	private int gamesPlayed;
	private int wins;
	private int losses;
	private LocalDateTime lastLogin;
	private List<PlayerProfileFriendEntity> friends;
	private List<Reword> rewords;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
