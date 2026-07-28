package com.omni_bank.omni_backend.controller;

import com.omni_bank.omni_backend.dto.OtpDTO;
import com.omni_bank.omni_backend.dto.RegistrationRequestDTO;
import com.omni_bank.omni_backend.dto.SigninDTO;
import com.omni_bank.omni_backend.service.AuthService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<?> registrationRequest(@RequestBody RegistrationRequestDTO registrationRequestDTO){
        return authService.RegistrationRequest(registrationRequestDTO);
    }
    @PostMapping("/verify/otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpDTO otpDTO){
        return authService.verifyOtp(otpDTO);
    }
    @PostMapping("/send/otp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpDTO otpDTO) throws MessagingException{
        return authService.sendOtp(otpDTO);
    }
    @GetMapping("/me")
    public ResponseEntity<?> me(){
        return authService.me();
    }
    @GetMapping("/logout")
    public ResponseEntity<?> logout(){
        return authService.logout();
    }
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody SigninDTO signinDTO){
        return authService.signin(signinDTO);
    }
}
