package com.example.demo.services.order;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.demo.models.Order;
import com.example.demo.models.Product;
import com.example.demo.dtos.order.CreateOrderDto;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.repositories.ProductRepository;

@Service
public class OrderService implements IOrderService {
    @Autowired
    private final OrderRepository orderRepository;
    @Autowired
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public List<Order> getOrdersByProduct(Long productId) {
        return orderRepository.findByProductId(productId);
    }

    @Override
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    @Override
    public Order createOrder(CreateOrderDto createOrderDto) {
        Product product = productRepository.findById(createOrderDto.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if there's enough stock
        if (product.getQuantity() < createOrderDto.getQuantity()) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        // Create new order
        Order order = new Order();
        order.setCustomerName(createOrderDto.getCustomerName());
        order.setOrderDate(createOrderDto.getOrderDate());
        order.setTotalAmount(createOrderDto.getTotalAmount());
        order.setStatus(createOrderDto.getStatus());
        order.setPaymentMethod(createOrderDto.getPaymentMethod());
        order.setProduct(product);
        order.setQuantity(createOrderDto.getQuantity());

        // Update product quantity
        product.setQuantity(product.getQuantity() - createOrderDto.getQuantity());
        productRepository.save(product);

        return orderRepository.save(order);
    }
} 