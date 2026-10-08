package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    private Integer id;

    @NotBlank(message = "Category cannot be blank")
private String category;

    @Positive(message = "Amount must be greater than 0")
private BigDecimal amount;

    // Connection with User table
    @ManyToOne
    @JoinColumn(name = "users_id")
    private User user;

    // Connection with PaymentMethod table
    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

   
    @NotNull(message = "Expense date is required")
private LocalDate expenses_date;


    // Getter for id
    public Integer getId() {
        return id;
    }

    // Setter for id
    public void setId(Integer id) {
        this.id = id;
    }


    // Getter for category
    public String getCategory() {
        return category;
    }

    // Setter for category
    public void setCategory(String category) {
        this.category = category;
    }


    // Getter for amount
    public BigDecimal getAmount() {
        return amount;
    }

    // Setter for amount
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }


    // Getter for User
    public User getUser() {
        return user;
    }

    // Setter for User
    public void setUser(User user) {
        this.user = user;
    }


    // Getter for PaymentMethod
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    // Setter for PaymentMethod
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }


    // Getter for expenses_date
    public LocalDate getExpenses_date() {
        return expenses_date;
    }

    // Setter for expenses_date
    public void setExpenses_date(LocalDate expenses_date) {
        this.expenses_date = expenses_date;
    }
}
