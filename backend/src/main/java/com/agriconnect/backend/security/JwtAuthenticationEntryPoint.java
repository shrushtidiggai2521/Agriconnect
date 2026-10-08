package com.agriconnect.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Invoked by Spring Security whenever an unauthenticated request hits a
 * protected endpoint. Returns a 401 in the SAME {@code ApiResponse} JSON
 * shape used everywhere else in the app, instead of Spring Security's default
 * HTML/blank response.
 * <p>
 * Built as a plain formatted string (no Jackson/ObjectMapper involved) to stay
 * completely decoupled from the app's Jackson 3 configuration.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        String body = """
                {
                  "success": false,
                  "message": "Unauthorized: authentication is required to access this resource",
                  "timestamp": "%s"
                }
                """.formatted(LocalDateTime.now());

        response.getWriter().write(body);
    }
}
