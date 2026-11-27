
package com.codewithwegza.roomswapapplication.Repository;

import com.codewithwegza.roomswapapplication.Models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

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

    // Count distinct users who have sent unread messages
    @Query("""
        SELECT COUNT(DISTINCT m.sender.userId)
        FROM ChatMessage m
        WHERE m.recipient.userId = :userId
        AND m.isRead = false
    """)
    Long countUnreadSenders(
            @Param("userId") Long userId
    );

    // Mark all messages from another user as read
    @Modifying
    @Transactional
    @Query("""
        UPDATE ChatMessage m
        SET m.isRead = true
        WHERE m.sender.userId = :senderId
        AND m.recipient.userId = :recipientId
        AND m.isRead = false
    """)
    void markConversationAsRead(
            @Param("senderId") Long senderId,
            @Param("recipientId") Long recipientId
    );
}
