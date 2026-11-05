
package com.codewithwegza.roomswapapplication.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class RoomImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomImageId;

    @Column(nullable = false)
    private String roomUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Rooms room;
}
