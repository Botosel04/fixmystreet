package com.smartcity.fixmystreet.controller;

import com.smartcity.fixmystreet.dto.CommentRequest;
import com.smartcity.fixmystreet.dto.CommentResponse;
import com.smartcity.fixmystreet.model.Comment;
import com.smartcity.fixmystreet.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/issues/{issueId}/comments")
public class CommentController {
    private final IssueService issueService;

    @Autowired
    public CommentController(IssueService issueService){
        this.issueService = issueService;
    }

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long issueId, @RequestBody CommentRequest request){
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Comment savedComment = issueService.addCommentToIssue(issueId, userEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(savedComment));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long issueId){
        List<CommentResponse> comments = issueService.getCommentsForIssue(issueId);
        return ResponseEntity.ok(comments);
    }

    private CommentResponse toResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setText(comment.getText());
        response.setCreatedAt(comment.getCreatedAt());
        response.setAuthorEmail(comment.getAuthor().getEmail());
        response.setAuthorRole(comment.getAuthor().getRole().name());
        return response;
    }
}
