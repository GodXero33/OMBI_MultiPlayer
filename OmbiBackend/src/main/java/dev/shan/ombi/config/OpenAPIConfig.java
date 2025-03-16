package dev.shan.ombi.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
	info = @Info(
		contact = @Contact(
			name = "GodXero",
			email = "shansathish38@gmail.com",
			url = ""
		),
		description = "OpenAPI documentation for OMBIArena backend",
		title = "OpenAPI specification - GodXero",
		version = "1.0.0",
		license = @License(
			name = "My License name",
			url = "https://license.exmple.com"
		),
		termsOfService = "Terms of Service"
	),
	servers = {
		@Server(
			description = "Local env",
			url = "http://127.0.0.1:5501"
		)
	}
)
public class OpenAPIConfig {
}
