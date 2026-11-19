
package com.codewithwegza.roomswapapplication.dto;

import java.time.LocalDateTime;

public record ConversationResponse(
        Long otherUserId,
        String otherUserName,
        String lastMessage,
        LocalDateTime lastMessageAt,
        Long lastMessageSenderId
) {
}

