
package com.codewithwegza.roomswapapplication.Services;

import com.codewithwegza.roomswapapplication.Models.RoomImages;
import com.codewithwegza.roomswapapplication.Models.Rooms;
import com.codewithwegza.roomswapapplication.Models.Users;
import com.codewithwegza.roomswapapplication.Repository.UserRepo;
import com.codewithwegza.roomswapapplication.Repository.RoomImagesRepo;
import com.codewithwegza.roomswapapplication.Repository.RoomsRepository;
import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;
import com.codewithwegza.roomswapapplication.dto.RoomListingResponse;
import com.codewithwegza.roomswapapplication.dto.PostRoomRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    RoomsRepository roomsRepository;

    @Autowired
    S3StorageService s3StorageService;

    @Autowired
    RoomImagesRepo roomImagesRepo;

    @Autowired
    UserRepo userRepo;


    // Retrieve all room listings
    @Transactional(readOnly = true)
    public List<RoomListingResponse> getAllRooms() {

        List<Rooms> rooms = roomsRepository.findAll();

        List<Long> roomIds = rooms.stream()
                .map(Rooms::getRoomId)
                .toList();

        List<RoomImages> roomImages = roomIds.isEmpty()
                ? List.of()
                : roomImagesRepo.findByRoom_RoomIdIn(roomIds);

        Map<Long, List<String>> imagesByRoom = roomImages.stream()
                .collect(Collectors.groupingBy(
                        image -> image.getRoom().getRoomId(),
                        Collectors.mapping(
                                image -> s3StorageService.generatePresignedUrl(
                                        "roomswap-images-unique-number",
                                        image.getRoomUrl()
                                ),
                                Collectors.toList()
                        )
                ));

        return rooms.stream()
                .map(room -> new RoomListingResponse(
                        room.getRoomId(),
                        room.getRoomTitle(),
                        room.getDescription(),
                        room.getLocation(),
                        room.getGenderPreference(),
                        room.getUser().getUserId(),
                        imagesByRoom.getOrDefault(
                                room.getRoomId(),
                                List.of()
                        )
                ))
                .toList();
    }


    // Create a new room listing
    @Transactional
    public String postRoom(
            PostRoomRequest postRoomRequest,
            AuthenticatedUser authenticatedUser
    ) throws Exception {

        // Validate uploaded pictures
        if (postRoomRequest.getRoomPictures() == null
                || postRoomRequest.getRoomPictures().length == 0) {

            throw new IllegalArgumentException(
                    "Please upload pictures of the room."
            );
        }

        int validImageCount = 0;

        for (MultipartFile image : postRoomRequest.getRoomPictures()) {

            if (image != null && !image.isEmpty()) {
                validImageCount++;
            }
        }

        if (validImageCount == 0) {

            throw new IllegalArgumentException(
                    "Please upload at least one valid picture."
            );
        }

        // Retrieve the authenticated user
        Users user = userRepo.findById(authenticatedUser.userId())
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        // Create the room
        Rooms room = new Rooms();

        room.setRoomTitle(postRoomRequest.getRoomTitle());
        room.setDescription(postRoomRequest.getDescription());
        room.setLocation(postRoomRequest.getLocation());
        room.setGenderPreference(
                postRoomRequest.getGenderPreferrence()
        );
        room.setUser(user);

        room = roomsRepository.save(room);

        int uploadedCount = 0;

        // Upload pictures to Amazon S3
        for (MultipartFile roomPicture : postRoomRequest.getRoomPictures()) {

            if (roomPicture == null || roomPicture.isEmpty()) {
                continue;
            }

            // Generate a unique S3 key
            String roomUrl = "room/" + room.getRoomId() + "/"
                    + System.currentTimeMillis() + "-" + uploadedCount;

            // Upload image to S3
            s3StorageService.uploadImage(
                    "roomswap-images-unique-number",
                    roomUrl,
                    roomPicture.getBytes(),
                    roomPicture.getContentType()
            );

            // Save image information in PostgreSQL
            RoomImages roomImages = new RoomImages();

            roomImages.setRoom(room);
            roomImages.setRoomUrl(roomUrl);

            roomImagesRepo.save(roomImages);

            uploadedCount++;
        }

        return uploadedCount + " room picture(s) uploaded successfully!";
    }
}
