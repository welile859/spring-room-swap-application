package com.codewithwegza.roomswapapplication.Services;


import com.codewithwegza.roomswapapplication.Models.RoomImages;
import com.codewithwegza.roomswapapplication.Models.Rooms;
import com.codewithwegza.roomswapapplication.Models.Users;
import com.codewithwegza.roomswapapplication.Repository.RoomImagesRepo;
import com.codewithwegza.roomswapapplication.Repository.RoomsRepository;
import com.codewithwegza.roomswapapplication.dto.PostRoomRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RoomService {

    @Autowired
    RoomsRepository roomsRepository;

    @Autowired
    S3StorageService s3StorageService;

    @Autowired
    RoomImagesRepo roomImagesRepo;

    public String postRoom(PostRoomRequest postRoomRequest, Users user) throws Exception {

            Rooms room = new Rooms();
            room.setRoomTitle(postRoomRequest.getRoomTitle());
            room.setDescription(postRoomRequest.getDescription());
            room.setLocation(postRoomRequest.getLocation());
            room.setGenderPreference(postRoomRequest.getGenderPreferrence());
            room.setUser(user);

            room = roomsRepository.save(room);


        // Check whether pictures were uploaded
        if (postRoomRequest.getRoomPictures() == null
                || postRoomRequest.getRoomPictures().length == 0) {
            return "Please upload pictures of room.";
        }

        int uploadedCount = 0;

        for (MultipartFile roomPicture : postRoomRequest.getRoomPictures()) {

            if (roomPicture == null || roomPicture.isEmpty()) {
                continue;
            }

            // Generate a different key for each image
            String roomUrl = "room/" + room.getRoomId() + "/"
                    + System.currentTimeMillis() + "-" + uploadedCount;

            // Upload the image to S3
            s3StorageService.uploadImage(
                    "roomswap-images-unique-number",
                    roomUrl,
                    roomPicture.getBytes(),
                    roomPicture.getContentType()
            );

            // Save the image information in the database
            RoomImages roomImages = new RoomImages();
            roomImages.setRoom(room);
            roomImages.setRoomUrl(roomUrl);

            roomImagesRepo.save(roomImages);

            uploadedCount++;
        }

        if (uploadedCount == 0) {
            return "No valid pictures were uploaded.";
        }

        return uploadedCount + " room picture(s) uploaded successfully!";
    }
}
