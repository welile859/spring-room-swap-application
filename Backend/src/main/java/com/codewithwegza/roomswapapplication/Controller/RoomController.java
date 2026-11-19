package com.codewithwegza.roomswapapplication.Controller;

import com.codewithwegza.roomswapapplication.Services.RoomService;
import com.codewithwegza.roomswapapplication.Services.SessionService;
import com.codewithwegza.roomswapapplication.dto.PostRoomRequest;
import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;
import com.codewithwegza.roomswapapplication.dto.RoomListingResponse;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RoomController {

    @Autowired
    RoomService roomService;

    @Autowired
    SessionService sessionService;

    @PostMapping("/post/room")
    public String postRoom(
            @ModelAttribute PostRoomRequest postRoomRequest,
            HttpServletRequest request) throws Exception {

        AuthenticatedUser user =
                sessionService.getAuthenticatedUser(request);

        return roomService.postRoom(postRoomRequest, user);
    }

    @GetMapping("/rooms")
    public List<RoomListingResponse> getAllRooms() {
        return roomService.getAllRooms();
    }
}