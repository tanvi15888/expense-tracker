package com.example.demo.service;

import com.example.demo.entity.Expense;
import com.example.demo.entity.User;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET ALL EXPENSES FOR LOGGED-IN USER
    // =========================================================

    public List<Expense> getAllExpenses() {

        User loggedInUser = getLoggedInUser();

        return expenseRepository.findByUser_Emailid(
                loggedInUser.getEmailid()
        );
    }

    // =========================================================
    // GET ONE EXPENSE
    // =========================================================

    public Expense getExpenseById(Integer id) {

        User loggedInUser = getLoggedInUser();

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Expense not found"
                        )
                );

        // Make sure this expense belongs to the logged-in user
        if (expense.getUser() == null
                || !expense.getUser().getId()
                    .equals(loggedInUser.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to access this expense"
            );
        }

        return expense;
    }

    // =========================================================
    // ADD EXPENSE
    // =========================================================

    public Expense addExpense(Expense expense) {

        User loggedInUser = getLoggedInUser();

        /*
         * Important:
         * Do NOT trust the user ID sent by React.
         * The logged-in user from the JWT becomes
         * the owner of the expense.
         */
        expense.setUser(loggedInUser);

        return expenseRepository.save(expense);
    }

    // =========================================================
    // UPDATE EXPENSE
    // =========================================================

    public Expense updateExpense(
            Integer id,
            Expense expense) {

        User loggedInUser = getLoggedInUser();

        Expense existingExpense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Expense not found"
                                )
                        );

        // Check ownership
        if (existingExpense.getUser() == null
                || !existingExpense.getUser().getId()
                    .equals(loggedInUser.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to update this expense"
            );
        }

        // Update only the allowed fields
        existingExpense.setCategory(
                expense.getCategory()
        );

        existingExpense.setAmount(
                expense.getAmount()
        );

        existingExpense.setExpenses_date(
                expense.getExpenses_date()
        );

        existingExpense.setPaymentMethod(
                expense.getPaymentMethod()
        );

        // Keep the original owner
        existingExpense.setUser(
                loggedInUser
        );

        return expenseRepository.save(
                existingExpense
        );
    }

    // =========================================================
    // DELETE EXPENSE
    // =========================================================

    public void deleteExpense(Integer id) {

        User loggedInUser = getLoggedInUser();

        Expense existingExpense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Expense not found"
                                )
                        );

        // Check ownership
        if (existingExpense.getUser() == null
                || !existingExpense.getUser().getId()
                    .equals(loggedInUser.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to delete this expense"
            );
        }

        expenseRepository.delete(
                existingExpense
        );
    }

    // =========================================================
    // GET LOGGED-IN USER
    // =========================================================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        String email =
                authentication.getName();

        return userRepository
                .findByEmailid(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Logged-in user not found"
                        )
                );
    }
}