package dev.shan.ombi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Player {
	private Long id;
	private String playerId;
	private String playerName;
	private String password;
	private String email;
}
