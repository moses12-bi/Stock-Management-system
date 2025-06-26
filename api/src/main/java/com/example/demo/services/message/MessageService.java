package com.example.demo.services.message;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.models.Message;
import com.example.demo.repositories.MessageRepository;

@Service
public class MessageService implements IMessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;

    }

    @Override
    public List<Message> GetAllMessages() {
        return messageRepository.findAll();
    }

    @Override
    public List<Message> GetAllReadMessages() {
        return messageRepository.findByIsRead(true);

    }

    @Override
    public Message MarkAsRead(Long Id) {
        Message message = messageRepository.findById(Id)
            .orElseThrow(() -> new RuntimeException("Message not found with id: " + Id));
        message.setIsRead(true);
        return messageRepository.save(message);
    }

    @Override
    public Message GetMessageById(Long Id) {
        return messageRepository.findById(Id).orElseThrow();
    }

    @Override
    public long CountReadMessages() {
        return messageRepository.countByIsRead(false);

    }
}
