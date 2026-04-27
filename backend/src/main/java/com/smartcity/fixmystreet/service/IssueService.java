package com.smartcity.fixmystreet.service;

import com.smartcity.fixmystreet.dto.CommentRequest;
import com.smartcity.fixmystreet.dto.CommentResponse;
import com.smartcity.fixmystreet.dto.ReportRequest;
import com.smartcity.fixmystreet.model.*;
import com.smartcity.fixmystreet.repository.CommentRepository;
import com.smartcity.fixmystreet.repository.ReportedIssueRepository;
import com.smartcity.fixmystreet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smartcity.fixmystreet.repository.IssueCategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IssueService {
    private  final ReportedIssueRepository reportedIssueRepository;
    private  final UserRepository userRepository;
    private final IssueCategoryRepository categoryRepository;
    private final CommentRepository commentRepository;

    @Autowired
    public IssueService(ReportedIssueRepository reportedIssueRepository, UserRepository userRepository, IssueCategoryRepository categoryRepository, CommentRepository commentRepository) {
        this.reportedIssueRepository = reportedIssueRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.commentRepository = commentRepository;
    }

    private ReportedIssue getIssueAndVerifyOwnership(Long issueId, String loggedInEmail){
        ReportedIssue foundIssue = reportedIssueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));

        if (foundIssue.getAssignedWorker() == null) {
            throw new RuntimeException("Issue with id: " + issueId + " has no assigned worker yet.");
        }

        String assignedEmail = foundIssue.getAssignedWorker().getEmail();
        if(!assignedEmail.equals(loggedInEmail)){
            throw new RuntimeException("Issue with id: " + issueId + "is assigned to other worker");
        }
        return foundIssue;
    }

    public void claimIssue(long issueId,  String loggedInEmail){
        ReportedIssue foundIssue = reportedIssueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));
        if(foundIssue.getStatus() != IssueStatus.BACKLOG){
            throw  new RuntimeException("Issue with id: " + issueId + " is already claimed");
        }
        User loggedInUser = userRepository.findByEmail(loggedInEmail);
        foundIssue.setAssignedWorker(loggedInUser);
        foundIssue.setStatus(IssueStatus.ASSIGNED);
        reportedIssueRepository.save(foundIssue);
    }

    public void startIssue(long issueId, String loggedInEmail){
        ReportedIssue foundIssue = getIssueAndVerifyOwnership(issueId, loggedInEmail);
        if(foundIssue.getStatus() != IssueStatus.ASSIGNED){
            throw new RuntimeException("Issue with id: " + issueId + "is not in 'ASSIGNED' phase");
        }
        foundIssue.setStatus(IssueStatus.IN_PROGRESS);
        reportedIssueRepository.save(foundIssue);
    }

    public void resolveIssue(Long issueId, String loggedInEmail) {
        ReportedIssue foundIssue = getIssueAndVerifyOwnership(issueId, loggedInEmail);
        if(foundIssue.getStatus() != IssueStatus.IN_PROGRESS){
            throw new RuntimeException("Issue with id: " + issueId + "is not in 'IN_PROGRESS' phase");
        }
        foundIssue.setStatus(IssueStatus.FINISHED);
        reportedIssueRepository.save(foundIssue);
    }

    public ReportedIssue createIssue(ReportRequest incomingData, String citizenMail){
        IssueCategory category = categoryRepository.findById(incomingData.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        ReportedIssue newIssue = new ReportedIssue();
        newIssue.setIssueCategory(category);
        newIssue.setDescription(incomingData.getDescription());
        newIssue.setStatus(IssueStatus.BACKLOG);

        Location location = new Location();
        if(incomingData.getLatitude()  != null && incomingData.getLongitude() != null){
            location.setY(incomingData.getLatitude());
            location.setX(incomingData.getLongitude());
        }
        if(incomingData.getAddress() != null && !incomingData.getAddress().trim().isEmpty()){
            location.setAddress(incomingData.getAddress());
        }
        if (location.getX() == null && location.getAddress() == null) {
            throw new IllegalArgumentException("A reported issue must have at least an address or map coordinates.");
        }

        newIssue.setLocation(location);

        if(citizenMail != null){
            User  citizen = userRepository.findByEmail(citizenMail);
            newIssue.setAuthor(citizen);
        }else{
            newIssue.setAuthor(null);
        }

        return reportedIssueRepository.save(newIssue);
    }

    public List<ReportedIssue> getAllIssues() {
        return reportedIssueRepository.findAll();
    }

    public Comment addCommentToIssue(Long issueId, String userEmail, CommentRequest request){
        ReportedIssue issue = reportedIssueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        User author = userRepository.findByEmail(userEmail);
        if(author == null){
            throw new RuntimeException("User not found");
        }

        Comment comment = new Comment();
        comment.setText(request.getText());
        comment.setAuthor(author);
        comment.setReportedIssue(issue);

        return commentRepository.save(comment);
    }

    public List<CommentResponse> getCommentsForIssue(Long issueId) {
        List<Comment> comments = commentRepository.findByReportedIssueIdOrderByCreatedAtAsc(issueId);
        return comments.stream().map(comment -> {
            CommentResponse response = new CommentResponse();
            response.setId(comment.getId());
            response.setText(comment.getText());
            response.setCreatedAt(comment.getCreatedAt());
            response.setAuthorEmail(comment.getAuthor().getEmail());
            response.setAuthorRole(comment.getAuthor().getRole().name());
            return response;
        }).collect(Collectors.toList());
    }



}
