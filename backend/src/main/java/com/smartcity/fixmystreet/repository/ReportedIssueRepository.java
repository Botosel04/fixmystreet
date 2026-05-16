package com.smartcity.fixmystreet.repository;

import com.smartcity.fixmystreet.model.IssueStatus;
import com.smartcity.fixmystreet.model.ReportedIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface ReportedIssueRepository extends JpaRepository<ReportedIssue, Long> {

    List<ReportedIssue> findByStatus(IssueStatus status);

    List<ReportedIssue> findByAuthorEmail(String email);

    // --- We replaced the old query with this upgraded "IS NULL" version ---
    @Query(value = "SELECT * FROM reported_issue r " +
            "WHERE r.status = 'BACKLOG' " +
            "AND (:categoryId IS NULL OR r.category_id = :categoryId) " +
            "AND (CAST(:fromTimestamp AS timestamp) IS NULL OR r.created_at >= CAST(:fromTimestamp AS timestamp)) " +
            "AND (CAST(:toTimestamp AS timestamp) IS NULL OR r.created_at <= CAST(:toTimestamp AS timestamp)) " +
            "AND (6371 * acos(cos(radians(:lat)) * cos(radians(r.y)) * " +
            "cos(radians(r.x) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(r.y)))) <= :radiusKm",
            nativeQuery = true)
    List<ReportedIssue> findNearbyFilteredBacklog(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusKm") double radiusKm,
            @Param("categoryId") Long categoryId,
            @Param("fromTimestamp") Timestamp fromTimestamp,
            @Param("toTimestamp") Timestamp toTimestamp
    );

    @Query("SELECT i FROM ReportedIssue i WHERE i.assigned_worker.email = :email AND i.status = 'FINISHED' ORDER BY i.createdAt DESC")
    List<ReportedIssue> findFinishedTasksByWorkerEmail(@Param("email") String email);
}