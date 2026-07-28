package com.omni_bank.omni_backend.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
@Service
public class OtpService {
    private final static SecureRandom random=new SecureRandom();
    public  String generateOtp() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
