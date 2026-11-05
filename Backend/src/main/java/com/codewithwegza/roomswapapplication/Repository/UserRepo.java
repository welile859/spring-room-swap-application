package com.codewithwegza.roomswapapplication.Repository;

import com.codewithwegza.roomswapapplication.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<Users, Long> {

    boolean existsByEmail(String email);

    Users findByEmail(String email);
}
