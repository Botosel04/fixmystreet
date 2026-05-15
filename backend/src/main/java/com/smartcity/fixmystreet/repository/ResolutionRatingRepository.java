package com.smartcity.fixmystreet.repository;

import com.smartcity.fixmystreet.model.ReportedIssue;
import com.smartcity.fixmystreet.model.ResolutionRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResolutionRatingRepository extends JpaRepository<ResolutionRating, Long> {
    Optional<ResolutionRating> findByReportedIssue(ReportedIssue reportedIssue);
}
