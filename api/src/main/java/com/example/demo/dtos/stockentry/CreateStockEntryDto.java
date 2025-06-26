package com.example.demo.dtos.stockentry;

import java.util.Date;
import lombok.Data;

@Data
public class CreateStockEntryDto {
    private Long productId;
    private int quantity;
    private Date date;
    private Long supplierId;

}
