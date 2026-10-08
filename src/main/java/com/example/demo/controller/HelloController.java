package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello Tanvi!";
    }
    @GetMapping("/welcome")
    public String welcome() {
        return "welcome to expense tracker";
    }
        
}
