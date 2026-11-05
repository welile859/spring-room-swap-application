package com.codewithwegza.roomswapapplication.dto;

import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
public class SendMessage {

    String message;

    MultipartFile file;
}
