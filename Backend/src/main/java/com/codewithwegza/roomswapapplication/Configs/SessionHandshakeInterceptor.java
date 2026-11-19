package com.codewithwegza.roomswapapplication.Configs;

import com.codewithwegza.roomswapapplication.Services.SessionService;
import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class SessionHandshakeInterceptor implements HandshakeInterceptor {

    private final SessionService sessionService;

    public SessionHandshakeInterceptor(SessionService sessionService) {
        this.sessionService = sessionService;
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
            AuthenticatedUser user =
                    sessionService.getAuthenticatedUser(httpRequest);

            attributes.put("userId", user.userId());
            attributes.put("fullName", user.fullName());

            System.out.println(
                    "WebSocket authenticated user: " + user.userId()
            );

            return true;

        } catch (RuntimeException exception) {

            System.out.println("WebSocket authentication failed!");
            System.out.println(exception.getMessage());

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