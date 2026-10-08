package com.agriconnect.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Invoked when an AUTHENTICATED user (valid JWT) tries to access something
 * their role doesn't permit, e.g. a future {@code @PreAuthorize("hasRole('FARMER')")}
 * check. Not strictly required by the current "authenticated vs public" rules,
 * but included so role-based restrictions added later already have a clean
 * 403 response instead of Spring Security's default.
 */
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        String body = """
                {
                  "success": false,
                  "message": "Forbidden: you do not have permission to access this resource",
                  "timestamp": "%s"
                }
                """.formatted(LocalDateTime.now());

        response.getWriter().write(body);
    }
}
