
package com.codewithwegza.roomswapapplication.Configs;
import org.springframework.messaging.simp.config.ChannelRegistration;
import com.codewithwegza.roomswapapplication.Services.SessionService;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final SessionService sessionService;
    private final WebSocketChannelInterceptor webSocketChannelInterceptor;

    public WebSocketConfig(
            SessionService sessionService,
            WebSocketChannelInterceptor webSocketChannelInterceptor) {

        this.sessionService = sessionService;
        this.webSocketChannelInterceptor = webSocketChannelInterceptor;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")
                .addInterceptors(
                        new SessionHandshakeInterceptor(sessionService)
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

