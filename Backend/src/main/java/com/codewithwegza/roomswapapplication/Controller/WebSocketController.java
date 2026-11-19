
package com.codewithwegza.roomswapapplication.Controller;

import com.codewithwegza.roomswapapplication.Models.ChatMessage;
import com.codewithwegza.roomswapapplication.Services.ChatMessageService;
import com.codewithwegza.roomswapapplication.dto.ChatMessageResponse;
import com.codewithwegza.roomswapapplication.dto.Message;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    public WebSocketController(
            SimpMessagingTemplate messagingTemplate,
            ChatMessageService chatMessageService) {

        this.messagingTemplate = messagingTemplate;
        this.chatMessageService = chatMessageService;
    }

    @MessageMapping("/private-message")
    public void sendPrivateMessage(
            Message message,
            Principal principal) {

        // Identify sender using authenticated connection
        Long senderId = Long.valueOf(principal.getName());

        // Identify recipient
        Long recipientId = message.getRecipientId();

        // Prevent users from messaging themselves
        if (recipientId == null || senderId.equals(recipientId)) {
            throw new IllegalArgumentException(
                    "You cannot send a message to yourself."
            );
        }

        // Save message in PostgreSQL
        ChatMessage savedMessage = chatMessageService.saveMessage(
                senderId,
                recipientId,
                message.getMessage()
        );

        ChatMessageResponse response = new ChatMessageResponse(
                savedMessage.getMessageId(),
                senderId,
                recipientId,
                savedMessage.getMessage(),
                savedMessage.getSentAt()
        );

        // Deliver the saved message privately
        messagingTemplate.convertAndSendToUser(
                recipientId.toString(),
                "/queue/messages",
                response
        );

        System.out.println(
                "Message saved and sent from user "
                        + senderId + " to user " + recipientId
        );
    }
}
