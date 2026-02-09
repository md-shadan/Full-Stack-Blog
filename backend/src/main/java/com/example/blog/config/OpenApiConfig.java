package com.example.blog.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Blog API",
                version = "1.0",
                description = "REST API for Blog Website"
        )
)
public class OpenApiConfig {
}
