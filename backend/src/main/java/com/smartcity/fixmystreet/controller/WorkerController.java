package com.smartcity.fixmystreet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/worker")
public class WorkerController {
    @GetMapping("/test")
    public ResponseEntity<String> testWorkerAccess(){
        return ResponseEntity.ok("Success!");
    }
}
