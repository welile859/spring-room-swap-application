package com.codewithwegza.roomswapapplication.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Rooms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @Column(nullable = false)
    private String roomTitle;

    private String description;

    @Column(nullable = false)
    private String location;

    @Column(name = "gender_preference", nullable = false)
    private String genderPreference;

    // Multiple room posts can belong to one user.
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;
}