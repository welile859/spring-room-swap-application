package com.codewithwegza.roomswapapplication.Controller;

import com.codewithwegza.roomswapapplication.Models.Users;
import com.codewithwegza.roomswapapplication.Services.RoomService;
import com.codewithwegza.roomswapapplication.Services.SessionService;
import com.codewithwegza.roomswapapplication.dto.PostRoomRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api")
public class RoomController {

    @Autowired
    RoomService roomService;

    @Autowired
    SessionService sessionService;


    @PostMapping("/post/room")
    public String postRoom(@ModelAttribute PostRoomRequest postRoomRequest, HttpServletRequest request) throws Exception{

        Users user = sessionService.getAuthenticatedUser(request);

        return roomService.postRoom(postRoomRequest, user);
    }
}
