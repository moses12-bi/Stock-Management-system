package com.example.demo.services.supplier;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.supplier.CreateSupplierDto;
import com.example.demo.dtos.supplier.UpdateSupplierDto;
import com.example.demo.models.Supplier;
import com.example.demo.repositories.SupplierRepository;

@Service
public class SupplierService implements ISupplierService {
    @Autowired
    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public Supplier CreateSupplier(CreateSupplierDto createSupplierDto) {
        Supplier supplier = new Supplier();
        supplier.setName(createSupplierDto.getName());
        supplier.setAddress(createSupplierDto.getAddress());
        supplier.setContact(createSupplierDto.getContact());
        supplier.setPhone(createSupplierDto.getPhone());
        return supplierRepository.save(supplier);

    }

    @Override
    public Supplier UpdateSupplier(UpdateSupplierDto updateSupplierDto, Long id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow();
        supplier.setName(updateSupplierDto.getName());
        supplier.setAddress(updateSupplierDto.getAddress());
        supplier.setContact(updateSupplierDto.getContact());
        supplier.setPhone(updateSupplierDto.getPhone());
        return supplierRepository.save(supplier);
    }

    @Override
    public List<Supplier> GetAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public Supplier GetSupplierById(Long id) {
        return supplierRepository.findById(id).orElseThrow();
    }

}
