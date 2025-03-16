package dev.shan.ombi.controller;

import dev.shan.ombi.service.PlayerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/player-profile")
public class PlayerProfileController {
	private final PlayerProfileService playerProfileService;
}
