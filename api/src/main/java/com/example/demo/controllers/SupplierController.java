package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dtos.supplier.CreateSupplierDto;
import com.example.demo.dtos.supplier.UpdateSupplierDto;
import com.example.demo.models.Supplier;
import com.example.demo.services.supplier.ISupplierService;

@RestController
@RequestMapping("/Api/Supplier/")
public class SupplierController {
    @Autowired
    private final ISupplierService supplierService;

    public SupplierController(ISupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Supplier>> GetAllFournisseurs() {

        return ResponseEntity.ok(supplierService.GetAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> GetFournisseurById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(supplierService.GetSupplierById(id));
    }

    @PostMapping("/")
    public ResponseEntity<Supplier> CreateSupplier(@RequestBody CreateSupplierDto supplier) {
        return ResponseEntity.ok(supplierService.CreateSupplier(supplier));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> UpdateSupplier(@PathVariable("id") Long id,
            @RequestBody UpdateSupplierDto supplier) {

        return ResponseEntity.ok(supplierService.UpdateSupplier(supplier, id));
    }
}
