
package com.codewithwegza.roomswapapplication.Controller;

import com.codewithwegza.roomswapapplication.Services.ChatMessageService;
import com.codewithwegza.roomswapapplication.Services.SessionService;
import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;
import com.codewithwegza.roomswapapplication.dto.ChatMessageResponse;
import com.codewithwegza.roomswapapplication.dto.ConversationResponse;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final SessionService sessionService;

    public ChatController(
            ChatMessageService chatMessageService,
            SessionService sessionService) {

        this.chatMessageService = chatMessageService;
        this.sessionService = sessionService;
    }

    @GetMapping("/unread-count")
    public Long getUnreadMessageCount(HttpServletRequest request) {

        AuthenticatedUser user =
                sessionService.getAuthenticatedUser(request);

        return chatMessageService.getUnreadConversationCount(
                user.userId()
        );
    }

    // Retrieve conversation history with a specific user
    @GetMapping("/messages/{otherUserId}")
    public List<ChatMessageResponse> getConversation(
            @PathVariable Long otherUserId,
            HttpServletRequest request) {

        AuthenticatedUser user =
                sessionService.getAuthenticatedUser(request);

        // Prevent users from opening conversations with themselves
        if (user.userId().equals(otherUserId)) {
            throw new IllegalArgumentException(
                    "You cannot open a conversation with yourself."
            );
        }

        return chatMessageService.getConversation(
                user.userId(),
                otherUserId
        );
    }

    // Retrieve all conversations for the logged-in user
    @GetMapping("/conversations")
    public List<ConversationResponse> getUserConversations(
            HttpServletRequest request) {

        AuthenticatedUser user =
                sessionService.getAuthenticatedUser(request);

        return chatMessageService.getUserConversations(
                user.userId()
        );
    }

}
