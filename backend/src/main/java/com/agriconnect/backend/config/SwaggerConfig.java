package com.agriconnect.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger documentation configuration.
 * UI available at: /swagger-ui.html
 * JSON spec at:    /api-docs
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI agriConnectOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AgriConnect Backend API")
                        .description("Agriculture Marketplace Platform - REST API documentation")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("AgriConnect Team")
                                .email("support@agriconnect.example"))
                        .license(new License()
                                .name("MIT License")));
    }
}
