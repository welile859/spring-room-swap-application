package com.codewithwegza.roomswapapplication.dto;

import java.time.LocalDateTime;

public record ChatMessageResponse(
        Long messageId,
        Long senderId,
        Long recipientId,
        String message,
        LocalDateTime sentAt
) {}