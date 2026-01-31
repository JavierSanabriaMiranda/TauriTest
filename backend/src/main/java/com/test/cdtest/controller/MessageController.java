package com.test.cdtest.controller;

import com.test.cdtest.entities.Message;
import com.test.cdtest.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*", allowedHeaders = "*") // Permite que Tauri conecte desde cualquier sitio
public class MessageController {

    @Autowired
    private MessageRepository repository;

    @PostMapping
    public Message saveMessage(@RequestBody String text) {
        Message msg = new Message();
        msg.setContent(text);
        return repository.save(msg);
    }
}
