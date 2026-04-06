package com.smartcity.fixmystreet.controller;

import com.smartcity.fixmystreet.dto.ReportRequest;
import com.smartcity.fixmystreet.model.Location;
import com.smartcity.fixmystreet.model.ReportedIssue;
import com.smartcity.fixmystreet.repository.ReportedIssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/issues")
public class ReportController {
    private final ReportedIssueRepository repository;

    @Autowired
    public ReportController(ReportedIssueRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/report")
    public ReportedIssue receiveReport(@RequestBody ReportRequest incomingData){
        System.out.println("Saving new issue from React");
        ReportedIssue newIssue = new ReportedIssue();
        newIssue.setIssueType(incomingData.getIssueType());
        newIssue.setDescription(incomingData.getDescription());

        Location location = new Location();
        location.setAddress(incomingData.getAddress());
        newIssue.setLocation(location);

        return repository.save(newIssue);
    }

    @GetMapping("/all")
    public List<ReportedIssue> getAllIssues() {
        System.out.println("React is asking for all issues...");
        return repository.findAll();
    }
}
