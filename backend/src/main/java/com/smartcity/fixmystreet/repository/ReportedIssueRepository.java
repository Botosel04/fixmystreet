package com.smartcity.fixmystreet.repository;

import com.smartcity.fixmystreet.model.IssueStatus;
import com.smartcity.fixmystreet.model.ReportedIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportedIssueRepository extends JpaRepository<ReportedIssue, Long> {
    List<ReportedIssue> findByStatus(IssueStatus status);

    @Query(value = "SELECT * FROM reported_issue r " +
            "WHERE r.status = 'BACKLOG' " +
            "AND r.category_id = :categoryId " +
            "AND (6371 * acos(cos(radians(:workerLat)) * cos(radians(r.y)) * " +
            "cos(radians(r.x) - radians(:workerLon)) + " +
            "sin(radians(:workerLat)) * sin(radians(r.y)))) <= :radiusKm",
            nativeQuery = true)
    List<ReportedIssue> findNearbyBacklogIssues(
            @Param("categoryId") Long categoryId,
            @Param("workerLat") Double workerLat,
            @Param("workerLon") Double workerLon,
            @Param("radiusKm") Double radiusKm
    );

    List<ReportedIssue> findByAuthorEmail(String email);

}
