
package com.codewithwegza.roomswapapplication.Configs;

import com.codewithwegza.roomswapapplication.Services.AuthService;
import com.codewithwegza.roomswapapplication.Services.JwtService;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final AuthService authService;
    private final WebSocketChannelInterceptor webSocketChannelInterceptor;

    public WebSocketConfig(
            JwtService jwtService,
            AuthService authService,
            WebSocketChannelInterceptor webSocketChannelInterceptor) {

        this.jwtService = jwtService;
        this.authService = authService;
        this.webSocketChannelInterceptor = webSocketChannelInterceptor;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")
                .addInterceptors(
                        new SessionHandshakeInterceptor(jwtService, authService)
                )
                .setAllowedOrigins("http://localhost:5173")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        registry.enableSimpleBroker("/topic", "/queue");

        registry.setApplicationDestinationPrefixes("/app");

        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {

        registration.interceptors(webSocketChannelInterceptor);
    }
}
