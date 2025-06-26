package com.example.demo.services.scheduledtask;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.models.Product;
import com.example.demo.models.Message;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.MessageRepository;

@Service
public class ScheduledTaskService implements IScheduledTaskService {
    @Autowired
    private final ProductRepository productRepository;
    @Autowired
    private final MessageRepository messageRepository;

    public ScheduledTaskService(ProductRepository productRepository, MessageRepository messageRepository,
            MessageRepository messageRepository2) {
        this.productRepository = productRepository;
        this.messageRepository = messageRepository2;

    }

    @Override
    @Scheduled(cron = "0 0 8 * * *")
    public void CheckStockEpouisee() {
        List<Product> articles = productRepository.findByQuantityLessThanEqual(10);
        for (Product article : articles) {
            Message message = new Message();
            message.setIsRead(false);
            message.setContent("Product: " + article.getName() +
                    "\nThe product " + article.getName() + " is currently out of stock." +
                    "\nWe recommend taking the following actions:" +
                    "\n\n1. Notify the supplier for a quick restock." +
                    "\n2. Check available alternatives to offer similar products." +
                    "\n3. Follow notifications to be informed when the product is back in stock." +
                    "\n\nWe will keep you informed as soon as the product is restocked.");
            message.setTitle("Product " + article.getName() + " is currently out of stock.");
            messageRepository.save(message);
        }

    }

}
