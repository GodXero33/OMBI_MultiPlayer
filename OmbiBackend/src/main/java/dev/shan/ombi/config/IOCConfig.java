package dev.shan.ombi.config;

import dev.shan.ombi.repository.custom.PlayerRepository;
import dev.shan.ombi.repository.custom.impl.PlayerRepositoryImpl;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IOCConfig {
	@Bean
	public ModelMapper getModelMapper () {
		return new ModelMapper();
	}

	@Bean
	public PlayerRepository getPlayerRepository () {
		return new PlayerRepositoryImpl();
	}
}
