package com.codewithwegza.roomswapapplication.Repository;

import com.codewithwegza.roomswapapplication.Models.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepo extends JpaRepository<Token, Long> {

    Optional<Token> findByTokenString(String tokenString);

    boolean existsByTokenString(String token);
}
