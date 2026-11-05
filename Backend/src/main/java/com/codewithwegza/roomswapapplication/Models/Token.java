package com.codewithwegza.roomswapapplication.Models;

import jakarta.persistence.*;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long Id;

    String tokenString;

    Instant expiryTime = Instant.now().plusSeconds(3600);


    @ManyToOne
    @JoinColumn(name = "user_id")
    Users users;


}
