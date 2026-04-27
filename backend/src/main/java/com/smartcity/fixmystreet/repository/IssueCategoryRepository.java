package com.smartcity.fixmystreet.repository;

import com.smartcity.fixmystreet.model.IssueCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueCategoryRepository extends JpaRepository<IssueCategory, Long> {
     IssueCategory findByName(String name);
}
