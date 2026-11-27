package com.codewithwegza.roomswapapplication.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long userId;

    String fullName;

    String hashedPassword;

    String email;

    Boolean isVerified;

    // One user can have multiple room listings.
    @OneToMany(mappedBy = "user")
    private List<Rooms> rooms;
}