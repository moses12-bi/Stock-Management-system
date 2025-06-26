package com.example.demo.services.message;

import java.util.List;

import com.example.demo.models.Message;

public interface IMessageService {
    List<Message> GetAllMessages();

    List<Message> GetAllReadMessages();

    Message MarkAsRead(Long Id);

    Message GetMessageById(Long Id);

    long CountReadMessages();
}
