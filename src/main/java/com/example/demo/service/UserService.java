package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));
    }

    public User addUser(User user) {

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password is required"
            );
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public User updateUser(Integer id, User user) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        existingUser.setName(user.getName());
        existingUser.setEmailid(user.getEmailid());
        existingUser.setAge(user.getAge());
        existingUser.setPhoneNO(user.getPhoneNO());

        /*
         * Only change the password if a new password was supplied.
         * This prevents the existing BCrypt password from being lost
         * when updating other user details.
         */
        if (user.getPassword() != null
                && !user.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(user.getPassword())
            );
        }

        return userRepository.save(existingUser);
    }

    public void deleteUser(Integer id) {

        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }

        userRepository.deleteById(id);
    }
}