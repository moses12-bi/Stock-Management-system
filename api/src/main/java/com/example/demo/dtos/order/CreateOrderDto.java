package com.example.demo.dtos.order;

import lombok.Data;
import java.util.Date;

@Data
public class CreateOrderDto {
    private String customerName;
    private Date orderDate;
    private double totalAmount;
    private String status;
    private String paymentMethod;
    private Long productId;
    private int quantity;
} 