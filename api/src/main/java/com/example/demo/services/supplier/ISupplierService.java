package com.example.demo.services.supplier;

import java.util.List;

import com.example.demo.dtos.supplier.CreateSupplierDto;
import com.example.demo.dtos.supplier.UpdateSupplierDto;
import com.example.demo.models.Supplier;

public interface ISupplierService {
    Supplier CreateSupplier(CreateSupplierDto createSupplierDto);

    Supplier UpdateSupplier(UpdateSupplierDto updateSupplierDto, Long id);

    List<Supplier> GetAllSuppliers();

    Supplier GetSupplierById(Long id);

}
