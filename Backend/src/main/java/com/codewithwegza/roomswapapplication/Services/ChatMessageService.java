
package com.codewithwegza.roomswapapplication.Services;

import com.codewithwegza.roomswapapplication.Models.ChatMessage;
import com.codewithwegza.roomswapapplication.Models.Users;
import com.codewithwegza.roomswapapplication.Repository.ChatMessageRepository;
import com.codewithwegza.roomswapapplication.Repository.UserRepo;
import com.codewithwegza.roomswapapplication.dto.ChatMessageResponse;
import com.codewithwegza.roomswapapplication.dto.ConversationResponse;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepo userRepo;

    public ChatMessageService(
            ChatMessageRepository chatMessageRepository,
            UserRepo userRepo) {

        this.chatMessageRepository = chatMessageRepository;
        this.userRepo = userRepo;
    }

    @Transactional
    public ChatMessage saveMessage(
            Long senderId,
            Long recipientId,
            String messageContent) {

        // Retrieve sender
        Users sender = userRepo.findById(senderId)
                .orElseThrow(() ->
                        new RuntimeException("Sender not found."));

        // Retrieve recipient
        Users recipient = userRepo.findById(recipientId)
                .orElseThrow(() ->
                        new RuntimeException("Recipient not found."));

        // Create message
        ChatMessage chatMessage = new ChatMessage();

        chatMessage.setSender(sender);
        chatMessage.setRecipient(recipient);
        chatMessage.setMessage(messageContent);

        // Save message
        return chatMessageRepository.save(chatMessage);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getConversation(
            Long userId,
            Long otherUserId) {

        return chatMessageRepository.findConversation(
                        userId,
                        otherUserId
                ).stream()
                .map(message -> new ChatMessageResponse(
                        message.getMessageId(),
                        message.getSender().getUserId(),
                        message.getRecipient().getUserId(),
                        message.getMessage(),
                        message.getSentAt()
                ))
                .toList();
    }

    // Retrieve the user's conversation list
    @Transactional(readOnly = true)
    public List<ConversationResponse> getUserConversations(Long userId) {

        List<ChatMessage> messages =
                chatMessageRepository.findMessagesForUser(userId);

        Map<Long, ConversationResponse> conversations =
                new LinkedHashMap<>();

        for (ChatMessage message : messages) {

            Long otherUserId;

            if (message.getSender().getUserId().equals(userId)) {
                otherUserId = message.getRecipient().getUserId();
            } else {
                otherUserId = message.getSender().getUserId();
            }

            // Keep only the newest message for each conversation
            conversations.putIfAbsent(
                    otherUserId,
                    new ConversationResponse(
                            otherUserId,
                            message.getSender().getUserId().equals(userId)
                                    ? message.getRecipient().getFullName()
                                    : message.getSender().getFullName(),
                            message.getMessage(),
                            message.getSentAt(),
                            message.getSender().getUserId()
                    )
            );
        }

        return List.copyOf(conversations.values());
    }
}
