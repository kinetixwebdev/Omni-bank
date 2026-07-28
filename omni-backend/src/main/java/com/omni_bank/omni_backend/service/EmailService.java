package com.omni_bank.omni_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("Omni Bank - Email Verification OTP");

        String html = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body{
                    font-family: Arial, Helvetica, sans-serif;
                    background:#f5f5f5;
                    margin:0;
                    padding:20px;
                }
                .container{
                    max-width:600px;
                    margin:auto;
                    background:#ffffff;
                    border-radius:10px;
                    overflow:hidden;
                    box-shadow:0 2px 8px rgba(0,0,0,0.1);
                }
                .header{
                    background:#0d6efd;
                    color:white;
                    padding:20px;
                    text-align:center;
                }
                .content{
                    padding:30px;
                    color:#333;
                }
                .otp{
                    text-align:center;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    background:#f8f9fa;
                    padding:20px;
                    border-radius:8px;
                    margin:25px 0;
                    color:#0d6efd;
                }
                .footer{
                    background:#f8f9fa;
                    padding:20px;
                    font-size:13px;
                    color:#666;
                    text-align:center;
                }
            </style>
        </head>

        <body>

        <div class="container">

            <div class="header">
                <h2>Omni Bank</h2>
            </div>

            <div class="content">

                <h3>Email Verification</h3>

                <p>Hello,</p>

                <p>
                    Thank you for registering with <strong>Omni Bank</strong>.
                    Please use the following One-Time Password (OTP)
                    to verify your email address.
                </p>

                <div class="otp">
                    %s
                </div>

                <p>
                    This OTP is valid for <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not request this verification,
                    please ignore this email.
                </p>

            </div>

            <div class="footer">
                © 2026 Omni Bank<br>
                This is an automated email. Please do not reply.
            </div>

        </div>

        </body>
        </html>
        """.formatted(otp);

        helper.setText(html, true);

        mailSender.send(message);
    }

    public void sendAccountApprovedEmail(String to) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("Omni Bank - Account Approved");

        String html = """
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body{
                font-family: Arial, Helvetica, sans-serif;
                background:#f5f5f5;
                margin:0;
                padding:20px;
            }
            .container{
                max-width:600px;
                margin:auto;
                background:#ffffff;
                border-radius:10px;
                overflow:hidden;
                box-shadow:0 2px 8px rgba(0,0,0,0.1);
            }
            .header{
                background:#198754;
                color:white;
                padding:20px;
                text-align:center;
            }
            .content{
                padding:30px;
                color:#333;
                line-height:1.6;
            }
            .status{
                text-align:center;
                font-size:24px;
                font-weight:bold;
                background:#e8f5e9;
                color:#198754;
                padding:20px;
                border-radius:8px;
                margin:25px 0;
            }
            .button{
                display:inline-block;
                padding:12px 25px;
                background:#198754;
                color:#ffffff !important;
                text-decoration:none;
                border-radius:5px;
                font-weight:bold;
                margin-top:20px;
            }
            .footer{
                background:#f8f9fa;
                padding:20px;
                font-size:13px;
                color:#666;
                text-align:center;
            }
        </style>
    </head>

    <body>

    <div class="container">

        <div class="header">
            <h2>Omni Bank</h2>
        </div>

        <div class="content">

            <h3>Congratulations!</h3>

            <p>Hello,</p>

            <p>
                We are pleased to inform you that your
                <strong>Omni Bank account has been successfully approved.</strong>
            </p>

            <div class="status">
                ✅ Your Account is Approved
            </div>

            <p>
                You can now log in to your account and enjoy all the banking
                services available through the Omni Bank platform.
            </p>

            <p style="text-align:center;">
                <a href="https://your-domain.com/login" class="button">
                    Login to Your Account
                </a>
            </p>

            <p>
                If you have any questions or did not create this account,
                please contact our support team immediately.
            </p>

            <p>
                Thank you for choosing <strong>Omni Bank</strong>.
                We look forward to serving you.
            </p>

        </div>

        <div class="footer">
            © 2026 Omni Bank<br>
            This is an automated email. Please do not reply.
        </div>

    </div>

    </body>
    </html>
    """;

        helper.setText(html, true);

        mailSender.send(message);
    }
}
