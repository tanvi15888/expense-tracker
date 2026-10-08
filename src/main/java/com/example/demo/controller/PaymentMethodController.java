package com.example.demo.controller;

import com.example.demo.entity.PaymentMethod;
import com.example.demo.service.PaymentMethodService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.util.List;

@RestController
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @GetMapping("/payment-methods")
    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodService.getAllPaymentMethods();
    }

    @PostMapping("/payment-methods")
    public PaymentMethod addPaymentMethod(@Valid @RequestBody PaymentMethod paymentMethod) {
        return paymentMethodService.addPaymentMethod(paymentMethod);
    }

    @GetMapping("/payment-methods/{id}")
    public PaymentMethod getPaymentMethodById(@PathVariable Integer id) {
        return paymentMethodService.getPaymentMethodById(id);
    }

    @PutMapping("/payment-methods/{id}")
    public PaymentMethod updatePaymentMethod(@PathVariable Integer id,
                                         @Valid @RequestBody PaymentMethod paymentMethod) {
        return paymentMethodService.updatePaymentMethod(id, paymentMethod);
    }

    @DeleteMapping("/payment-methods/{id}")
    public String deletePaymentMethod(@PathVariable Integer id) {
        paymentMethodService.deletePaymentMethod(id);
        return "Payment method deleted successfully";
    }
}
