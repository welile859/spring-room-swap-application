package com.codewithwegza.roomswapapplication.dto;

public record AuthenticatedUser(
        Long userId,
        String fullName
) {
}