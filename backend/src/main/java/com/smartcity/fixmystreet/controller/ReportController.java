package com.smartcity.fixmystreet.controller;

import com.smartcity.fixmystreet.dto.AnalyticsResponse;
import com.smartcity.fixmystreet.dto.ReportRequest;
import com.smartcity.fixmystreet.model.Location;
import com.smartcity.fixmystreet.model.ReportedIssue;
import com.smartcity.fixmystreet.repository.ReportedIssueRepository;
import com.smartcity.fixmystreet.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/issues")
public class ReportController {
    private final IssueService issueService;

    @Autowired
    public ReportController(IssueService issueService) {
        this.issueService = issueService;
    }


    @PostMapping("/report")
    public ResponseEntity<ReportedIssue> receiveReport(@RequestBody ReportRequest incomingData){
        String citizenEmail = null;
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null && auth.isAuthenticated() && !"guestUser".equals(auth.getName())){
            citizenEmail = auth.getName();
        }

        ReportedIssue createdIssue = issueService.createIssue(incomingData, citizenEmail);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdIssue);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReportedIssue>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @GetMapping("/my-impact")
    public ResponseEntity<AnalyticsResponse> getMyAnalytics(){
        String citizenEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        AnalyticsResponse stats = issueService.getImpactAnalysis(citizenEmail);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<ReportedIssue>> getMyHistory(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(issueService.getMyIssues(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportedIssue> getSingleIssue(@PathVariable Long id){
        ReportedIssue issue = issueService.getIssueById(id);
        return ResponseEntity.ok(issue);
    }
}
