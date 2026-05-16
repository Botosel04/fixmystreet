package com.smartcity.fixmystreet;

import com.smartcity.fixmystreet.dto.ReportRequest;
import com.smartcity.fixmystreet.model.IssueCategory;
import com.smartcity.fixmystreet.repository.*;
import com.smartcity.fixmystreet.service.EmailService;
import com.smartcity.fixmystreet.service.IssueService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.smartcity.fixmystreet.model.IssueStatus;
import com.smartcity.fixmystreet.model.ReportedIssue;
import com.smartcity.fixmystreet.model.User;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class IssueServiceTest {
    private ReportedIssueRepository reportedRepo;
    private UserRepository userRepo;
    private IssueCategoryRepository categoryRepo;
    private IssueService issueService;
    private CommentRepository commentRepo;
    private EmailService emailService;
    private ResolutionRatingRepository ratingRepo;

    @BeforeEach
    void setup(){
        reportedRepo = mock(ReportedIssueRepository.class);
        userRepo = mock(UserRepository.class);
        categoryRepo = mock(IssueCategoryRepository.class);
        commentRepo = mock(CommentRepository.class);
        emailService = mock(EmailService.class);
        ratingRepo = mock(ResolutionRatingRepository.class);

        issueService = new IssueService(reportedRepo, userRepo, categoryRepo, commentRepo, emailService, ratingRepo);
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

    @Test
    void rateIssueResolution_success() {
        String loggedInEmail = "citizen@example.com";
        User author = new User();
        author.setEmail(loggedInEmail);

        ReportedIssue issue = new ReportedIssue();
        issue.setId(100L);
        issue.setAuthor(author);
        issue.setStatus(IssueStatus.FINISHED);

        when(reportedRepo.findById(100L)).thenReturn(Optional.of(issue));
        when(ratingRepo.findByReportedIssue(issue)).thenReturn(Optional.empty());

        issueService.rateIssueResolution(100L, 5, "Great job!", loggedInEmail);

        verify(ratingRepo).save(any());
    }

    @Test
    void rateIssueResolution_throwsIfNotAuthor() {
        User realAuthor = new User();
        realAuthor.setEmail("real.citizen@example.com");

        ReportedIssue issue = new ReportedIssue();
        issue.setId(100L);
        issue.setAuthor(realAuthor);

        when(reportedRepo.findById(100L)).thenReturn(Optional.of(issue));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                issueService.rateIssueResolution(100L, 5, "Hacked!", "sneaky.hacker@example.com")
        );

        assertEquals("Unauthorized: You can only rate issues that you reported yourself.", exception.getMessage());
    }


    @Test
    void rateIssueResolution_throwsIfNotFinished() {
        String loggedInEmail = "citizen@example.com";
        User author = new User();
        author.setEmail(loggedInEmail);

        ReportedIssue issue = new ReportedIssue();
        issue.setId(100L);
        issue.setAuthor(author);

        issue.setStatus(IssueStatus.IN_PROGRESS);

        when(reportedRepo.findById(100L)).thenReturn(Optional.of(issue));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                issueService.rateIssueResolution(100L, 5, "Too early", loggedInEmail)
        );

        assertEquals("Only finished issues can be rated", exception.getMessage());
    }

}
