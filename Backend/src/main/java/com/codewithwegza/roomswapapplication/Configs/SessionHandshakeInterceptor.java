
package com.codewithwegza.roomswapapplication.Configs;

import com.codewithwegza.roomswapapplication.Services.AuthService;
import com.codewithwegza.roomswapapplication.Services.JwtService;
import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class SessionHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;
    private final AuthService authService;

    public SessionHandshakeInterceptor(
            JwtService jwtService,
            AuthService authService) {

        this.jwtService = jwtService;
        this.authService = authService;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            return false;
        }

        HttpServletRequest httpRequest =
                servletRequest.getServletRequest();

        try {

            String token = null;

            Cookie[] cookies = httpRequest.getCookies();

            if (cookies != null) {
                for (Cookie cookie : cookies) {

                    if ("ACCESS_TOKEN".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }

            if (token == null || !jwtService.isTokenValid(token)) {
                return false;
            }

            Long userId = jwtService.extractUserId(token);

            AuthenticatedUser user =
                    authService.getAuthenticatedUser(userId);

            attributes.put("userId", user.userId());
            attributes.put("fullName", user.fullName());

            System.out.println(
                    "WebSocket authenticated user: " + user.userId()
            );

            return true;

        } catch (RuntimeException exception) {

            System.out.println("WebSocket authentication failed!");

            return false;
        }
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }
}
