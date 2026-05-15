package com.smartcity.fixmystreet.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendEmail(String citizenEmail, Long issueId, String categoryName) {
        if(mailSender == null || citizenEmail.trim().isEmpty()) {
            return;
        }
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(citizenEmail);
            helper.setSubject("✅ Great news! Your reported issue has been resolved.");
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
                    <h2 style="color: #0f172a;">Smart City Cluj-Napoca</h2>
                    <p style="color: #334155; font-size: 16px;">Hello,</p>
                    <p style="color: #334155; font-size: 16px;">
                        We are writing to let you know that the <strong>%s</strong> (Issue #%d) you reported has been officially marked as <strong>Resolved</strong> by our city maintenance team!
                    </p>
                    <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #166534; font-weight: bold;">Thank you for helping keep our city clean and safe!</p>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">
                        You can view the final details and staff comments on the Fix My Street portal.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                        This is an automated message from the Fix My Street platform. Please do not reply directly to this email.
                    </p>
                </div>
            """.formatted(categoryName, issueId);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Resolution email successfully sent to: " + citizenEmail);
        }catch (Exception e){
            System.out.println("Failed to send resolution email to: " + citizenEmail + ". Error: " + e.getMessage());
        }
    }

}
