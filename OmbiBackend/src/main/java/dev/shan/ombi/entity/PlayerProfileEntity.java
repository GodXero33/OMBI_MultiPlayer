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
	private Long id;
	private String playerId;
	private Long score;
	private Integer gamesPlayed;
	private Integer wins;
	private Integer losses;
	private LocalDateTime lastLogin;
	private List<PlayerProfileFriendEntity> friends;
	private List<Reword> rewords;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
