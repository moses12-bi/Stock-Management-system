package com.example.demo.dtos.stockoutput;

import java.util.Date;

import lombok.Data;

@Data
public class UpdateStockOutputDto {
    private int quantity;
    private Date date;
    private String destination;
}
