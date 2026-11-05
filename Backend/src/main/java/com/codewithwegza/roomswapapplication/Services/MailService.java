package com.codewithwegza.roomswapapplication.Services;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;

@Service
public class MailService {

    private JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender){

        this.mailSender = mailSender;

    }

    public void sendEmail(String email, String token){

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);

        message.setSubject("Verify your account");

        message.setText("Click this link to verify: " + "http://localhost:8080/api/auth/verify?token=" + token);

        mailSender.send(message);

    }


}
