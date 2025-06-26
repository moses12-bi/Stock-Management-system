package com.example.demo.dtos.stockoutput;

import java.util.Date;
import lombok.Data;

@Data
public class CreateStockOutputDto {
    private Long productId;

    private int quantity;
    private Date date;
    private String destination;
}
