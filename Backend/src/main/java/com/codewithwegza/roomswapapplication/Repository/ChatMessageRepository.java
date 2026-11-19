
package com.codewithwegza.roomswapapplication.Repository;

import com.codewithwegza.roomswapapplication.Models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {

    // Retrieve messages exchanged between two specific users
    @Query("""
        SELECT m
        FROM ChatMessage m
        WHERE
            (m.sender.userId = :userId
            AND m.recipient.userId = :otherUserId)
            OR
            (m.sender.userId = :otherUserId
            AND m.recipient.userId = :userId)
        ORDER BY m.sentAt ASC
    """)
    List<ChatMessage> findConversation(
            @Param("userId") Long userId,
            @Param("otherUserId") Long otherUserId
    );

    // Retrieve all messages involving a particular user
    @Query("""
        SELECT m
        FROM ChatMessage m
        JOIN FETCH m.sender
        JOIN FETCH m.recipient
        WHERE
            m.sender.userId = :userId
            OR m.recipient.userId = :userId
        ORDER BY m.sentAt DESC, m.messageId DESC
    """)
    List<ChatMessage> findMessagesForUser(
            @Param("userId") Long userId
    );
}

