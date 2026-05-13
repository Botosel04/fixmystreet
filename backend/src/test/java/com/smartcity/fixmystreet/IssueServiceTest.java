package com.smartcity.fixmystreet;

import com.smartcity.fixmystreet.dto.ReportRequest;
import com.smartcity.fixmystreet.model.IssueCategory;
import com.smartcity.fixmystreet.repository.IssueCategoryRepository;
import com.smartcity.fixmystreet.repository.ReportedIssueRepository;
import com.smartcity.fixmystreet.repository.UserRepository;
import com.smartcity.fixmystreet.service.IssueService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class IssueServiceTest {
    private ReportedIssueRepository reportedRepo;
    private UserRepository userRepo;
    private IssueCategoryRepository categoryRepo;
    private IssueService issueService;

    @BeforeEach
    void setup(){
        reportedRepo = mock(ReportedIssueRepository.class);
        userRepo = mock(UserRepository.class);
        categoryRepo = mock(IssueCategoryRepository.class);
        issueService = new IssueService(reportedRepo, userRepo, categoryRepo, null);
    }

    @Test
    void createIssue_requiresAddressOrCoordinates(){
        ReportRequest req = new ReportRequest();
        req.setCategoryId(1L);
        req.setDescription("desc");
        // neither address nor coords set
        when(categoryRepo.findById(1L)).thenReturn(Optional.of(new IssueCategory()));
        assertThrows(IllegalArgumentException.class, () -> issueService.createIssue(req, null));
    }
}
