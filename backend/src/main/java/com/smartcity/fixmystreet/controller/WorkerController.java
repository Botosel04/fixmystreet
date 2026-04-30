package com.smartcity.fixmystreet.controller;

import com.smartcity.fixmystreet.model.IssueStatus;
import com.smartcity.fixmystreet.model.ReportedIssue;
import com.smartcity.fixmystreet.repository.ReportedIssueRepository;
import com.smartcity.fixmystreet.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/worker")
public class WorkerController {
    private final ReportedIssueRepository repository;
    private final IssueService issueService;

    @Autowired
    public WorkerController(ReportedIssueRepository repository, IssueService issueService){
        this.repository = repository;
        this.issueService = issueService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> testWorkerAccess(){
        return ResponseEntity.ok("Success!");
    }

    @GetMapping("/backlog")
    public List<ReportedIssue> getBacklog(){
        return  repository.findByStatus(IssueStatus.BACKLOG);
    }

    @GetMapping("/backlog/nearby")
    public ResponseEntity<List<ReportedIssue>> getNearbyBacklogIssues(@RequestParam Long IssueId, @RequestParam double lat, @RequestParam double lng, @RequestParam double radiusKm){
        List<ReportedIssue> nearbyIssues = issueService.getNearbyTasks(IssueId, lat, lng, radiusKm);
        return ResponseEntity.ok(nearbyIssues);
    }

    @PatchMapping("/issues/{issueId}/claim")
    public ResponseEntity<String> claimIssue(@PathVariable Long issueId){
        String workerEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        issueService.claimIssue(issueId, workerEmail);
        return ResponseEntity.ok("Issue successfully claimed by " + workerEmail);
    }

    @PatchMapping("/issues/{issueId}/start")
    public ResponseEntity<String> startIssue(@PathVariable Long issueId){
        String workerEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        issueService.startIssue(issueId, workerEmail);
        return ResponseEntity.ok("Issue successfully started");
    }

    @PatchMapping("/issues/{issueId}/resolve")
    public ResponseEntity<String> resolveIssue(@PathVariable Long issueId){
        String workerEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        issueService.resolveIssue(issueId, workerEmail);
        return ResponseEntity.ok("Issue successfully resolved");
    }
}
