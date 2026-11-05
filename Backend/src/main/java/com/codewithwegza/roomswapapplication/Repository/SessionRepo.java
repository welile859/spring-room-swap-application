package com.codewithwegza.roomswapapplication.Repository;

import com.codewithwegza.roomswapapplication.Models.Sessions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SessionRepo extends JpaRepository<Sessions, Long> {

    @Query("SELECT s FROM Sessions s WHERE s.session_token_hash = :sessionHash")
    Optional<Sessions> findBySessionTokenHash(
            @Param("sessionHash") String sessionHash
    );
}
