
package com.codewithwegza.roomswapapplication.Controller;

import com.codewithwegza.roomswapapplication.Services.RoomService;
import com.codewithwegza.roomswapapplication.Services.AuthService;
import com.codewithwegza.roomswapapplication.dto.PostRoomRequest;
import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;
import com.codewithwegza.roomswapapplication.dto.RoomListingResponse;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RoomController {

    private final RoomService roomService;
    private final AuthService authService;

    public RoomController(
            RoomService roomService,
            AuthService authService) {

        this.roomService = roomService;
        this.authService = authService;
    }

    @PostMapping("/post/room")
    public String postRoom(
            @ModelAttribute PostRoomRequest postRoomRequest,
            Authentication authentication) throws Exception {

        Long userId = Long.parseLong(authentication.getName());

        AuthenticatedUser user =
                authService.getAuthenticatedUser(userId);

        return roomService.postRoom(postRoomRequest, user);
    }

    @GetMapping("/rooms")
    public List<RoomListingResponse> getAllRooms() {
        return roomService.getAllRooms();
    }
}
