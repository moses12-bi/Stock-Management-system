package com.example.demo.services.order;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.demo.models.Order;
import com.example.demo.dtos.order.CreateOrderDto;

public interface IOrderService {
    Page<Order> getAllOrders(Pageable pageable);
    Order getOrderById(Long id);
    List<Order> getOrdersByProduct(Long productId);
    List<Order> getOrdersByStatus(String status);
    Order createOrder(CreateOrderDto createOrderDto);
} 