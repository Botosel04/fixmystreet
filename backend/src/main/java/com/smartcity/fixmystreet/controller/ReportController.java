package com.smartcity.fixmystreet.controller;

import com.smartcity.fixmystreet.dto.ReportRequest;
import com.smartcity.fixmystreet.model.ReportIssue;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/issues")
public class ReportController {
    @PostMapping("/report")
    public String receiveReport(@RequestBody ReportRequest incomingData){
        System.out.println("Issue Type: " + incomingData.getIssueType());
        System.out.println("Address:    " + incomingData.getAddress());
        System.out.println("Details:    " + incomingData.getDescription());

        return "Backend succesfully received the report";
    }
}
