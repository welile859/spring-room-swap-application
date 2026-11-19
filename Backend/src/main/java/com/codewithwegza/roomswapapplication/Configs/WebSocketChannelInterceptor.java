
package com.codewithwegza.roomswapapplication.Configs;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Map;

@Component
public class WebSocketChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            Map<String, Object> attributes =
                    accessor.getSessionAttributes();

            if (attributes == null || attributes.get("userId") == null) {
                throw new MessageDeliveryException(
                        message,
                        "Authentication required."
                );
            }

            Object userId = attributes.get("userId");

            Principal principal = () -> userId.toString();

            accessor.setUser(principal);

            System.out.println(
                    "STOMP authenticated user: " + principal.getName()
            );
        }

        return message;
    }
}


