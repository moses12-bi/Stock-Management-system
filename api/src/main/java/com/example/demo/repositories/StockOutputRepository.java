package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.models.Product;
import com.example.demo.models.StockOutput;

public interface StockOutputRepository extends JpaRepository<StockOutput, Long> {
    List<StockOutput> findByProduct(Product product);

    @Query(value = """
            WITH LastFiveMonths AS (
                SELECT
                    DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' * generate_series(0, 4) AS month_start
            )
            SELECT
                to_char(month_start, 'YYYY-MM-DD') AS date,
                COALESCE(SUM(e.quantity), 0) AS quantity,
                COALESCE(SUM(e.quantity * p.price), 0) AS total_value
            FROM
                LastFiveMonths m
            LEFT JOIN
                stock_output e ON DATE_TRUNC('month', e.date) = m.month_start
            LEFT JOIN
                product p ON e.product_id = p.id
            GROUP BY
                month_start
            ORDER BY
                month_start;
            """, nativeQuery = true)
    List<Object[]> getStockOutputProgress();
}
