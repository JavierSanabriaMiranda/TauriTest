package com.test.cdtest.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/status")
    public Map<String, String> checkStatus() {
        return Map.of(
                "app", "Backend",
                "status", "Running on Azure",
                "version", "Prototype 1.0"
        );
    }
}