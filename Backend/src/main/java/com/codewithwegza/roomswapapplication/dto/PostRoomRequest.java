package com.codewithwegza.roomswapapplication.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class PostRoomRequest {

    MultipartFile[] roomPictures = new MultipartFile[3];

    String roomTitle;

    String description;

    String location;

    String genderPreferrence;

}
