package com.codewithwegza.roomswapapplication.Controller;

import com.codewithwegza.roomswapapplication.dto.SendMessage;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/messages")
public class MessageController {

    public void sendMessage(@RequestBody SendMessage message){



    }
}
