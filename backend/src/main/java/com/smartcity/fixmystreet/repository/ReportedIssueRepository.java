package com.smartcity.fixmystreet.repository;

import com.smartcity.fixmystreet.model.ReportedIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportedIssueRepository extends JpaRepository<ReportedIssue, Long> {
    List<ReportedIssue> findByStatus(String status);

}
