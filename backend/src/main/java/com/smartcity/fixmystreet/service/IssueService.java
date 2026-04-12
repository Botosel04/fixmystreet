package com.smartcity.fixmystreet.service;

import com.smartcity.fixmystreet.model.IssueStatus;
import com.smartcity.fixmystreet.model.ReportedIssue;
import com.smartcity.fixmystreet.model.User;
import com.smartcity.fixmystreet.repository.ReportedIssueRepository;
import com.smartcity.fixmystreet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IssueService {
    private  final ReportedIssueRepository reportedIssueRepository;
    private  final UserRepository userRepository;

    @Autowired
    public IssueService(ReportedIssueRepository reportedIssueRepository, UserRepository userRepository){
        this.reportedIssueRepository = reportedIssueRepository;
        this.userRepository = userRepository;
    }

    public void claimIssue(long issueId,  String loggedInEmail){
        ReportedIssue foundIssue = reportedIssueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));
        if(!(foundIssue.getStatus() == IssueStatus.BACKLOG)){
            throw  new RuntimeException("Issue with id: " + issueId + " is already claimed");
        }
        User loggedInUser = userRepository.findByEmail(loggedInEmail);
        foundIssue.setAssignedWorker(loggedInUser);
        foundIssue.setStatus(IssueStatus.ASSIGNED);
        reportedIssueRepository.save(foundIssue);
    }

}
