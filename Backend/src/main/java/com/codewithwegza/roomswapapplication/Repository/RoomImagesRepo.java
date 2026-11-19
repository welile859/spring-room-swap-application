
package com.codewithwegza.roomswapapplication.Repository;

import com.codewithwegza.roomswapapplication.Models.RoomImages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomImagesRepo extends JpaRepository<RoomImages, Long> {

    List<RoomImages> findByRoom_RoomIdIn(List<Long> roomIds);
}

