package com.example.demo.repository;

import com.example.demo.entity.PaymentMethod;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {

}
