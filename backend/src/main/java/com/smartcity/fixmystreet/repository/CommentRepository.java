package com.smartcity.fixmystreet.repository;

import com.smartcity.fixmystreet.model.Comment;
import com.smartcity.fixmystreet.model.ReportedIssue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByReportedIssueIdOrderByCreatedAtAsc(Long issueId);
}
