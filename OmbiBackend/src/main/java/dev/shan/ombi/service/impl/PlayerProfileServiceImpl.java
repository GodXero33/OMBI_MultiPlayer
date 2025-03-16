package dev.shan.ombi.service.impl;

import dev.shan.ombi.repository.custom.PlayerProfileRepository;
import dev.shan.ombi.service.PlayerProfileService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
@RequiredArgsConstructor
public class PlayerProfileServiceImpl implements PlayerProfileService {
	private final PlayerProfileRepository playerProfileRepository;
	private final ModelMapper modelMapper;
}
