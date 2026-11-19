
package com.codewithwegza.roomswapapplication.dto;

import java.util.List;

public record RoomListingResponse(
        Long roomId,
        String roomTitle,
        String description,
        String location,
        String genderPreference,
        Long ownerId,
        List<String> images
) {}
