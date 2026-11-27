

package com.codewithwegza.roomswapapplication.Controller;

import com.codewithwegza.roomswapapplication.Services.ChatMessageService;
import com.codewithwegza.roomswapapplication.dto.ChatMessageResponse;
import com.codewithwegza.roomswapapplication.dto.ConversationResponse;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatMessageService chatMessageService;

    public ChatController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    @GetMapping("/unread-count")
    public Long getUnreadMessageCount(Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());

        return chatMessageService.getUnreadConversationCount(userId);
    }

    // Retrieve conversation history with a specific user
    @GetMapping("/messages/{otherUserId}")
    public List<ChatMessageResponse> getConversation(
            @PathVariable Long otherUserId,
            Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());

        // Prevent users from opening conversations with themselves.
        if (userId.equals(otherUserId)) {
            throw new IllegalArgumentException(
                    "You cannot open a conversation with yourself."
            );
        }

        return chatMessageService.getConversation(
                userId,
                otherUserId
        );
    }

    // Retrieve all conversations for the logged-in user
    @GetMapping("/conversations")
    public List<ConversationResponse> getUserConversations(
            Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());

        return chatMessageService.getUserConversations(userId);
    }
}
