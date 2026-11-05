
package com.codewithwegza.roomswapapplication.Repository;

import com.codewithwegza.roomswapapplication.Models.Rooms;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomsRepository extends JpaRepository<Rooms, Long> {

    Optional<Rooms> findByUser_UserId(Long userId);
}
