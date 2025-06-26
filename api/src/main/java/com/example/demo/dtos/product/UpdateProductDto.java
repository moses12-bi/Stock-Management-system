package com.example.demo.dtos.product;

import lombok.Data;

@Data
public class UpdateProductDto {
    private String name;
    private String description;
    private int quantity;
    private double price;
    private Long categoryId;
    private Long supplierId;
    private String barCode;
}
