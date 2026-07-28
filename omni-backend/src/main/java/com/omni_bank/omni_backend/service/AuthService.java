package com.omni_bank.omni_backend.service;

import com.omni_bank.omni_backend.dto.OtpDTO;
import com.omni_bank.omni_backend.dto.RegistrationRequestDTO;

import com.omni_bank.omni_backend.dto.SigninDTO;
import com.omni_bank.omni_backend.entity.*;
import com.omni_bank.omni_backend.exception.AccountDeactivatedException;
import com.omni_bank.omni_backend.exception.AccountFreezeException;
import com.omni_bank.omni_backend.exception.AccountPendingException;
import com.omni_bank.omni_backend.repository.AccountRepository;
import com.omni_bank.omni_backend.repository.RegistrationRequestRepository;
import com.omni_bank.omni_backend.repository.UserRepository;
import com.omni_bank.omni_backend.util.JwtService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final RegistrationRequestRepository registrationRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AdminService adminService;

    public ResponseEntity<?> RegistrationRequest(RegistrationRequestDTO userDTO) {
        User user=userRepository.findByEmail(userDTO.getEmail());
        if(user!=null){
            throw new RuntimeException("User Already Exist Signin to Continue");
        }
        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .name(userDTO.getName())
                .address(userDTO.getAddress())
                .otp(otpService.generateOtp())
                .otpExpiry(LocalDateTime.now().plusMinutes(15))
                .cnicNumber(userDTO.getCnicNumber())
                .phoneNumber(userDTO.getPhoneNumber())
                .build();
        registrationRequestRepository.save(registrationRequest);
        return ResponseEntity.ok(Map.of("message","To Continue Verify Your Email"));
    }

    public ResponseEntity<?> verifyOtp(OtpDTO otpDTO) {
        RegistrationRequest user=registrationRequestRepository.findByEmail(otpDTO.getEmail());
        if(user==null){
            throw new RuntimeException("User not found");
        }
        if(LocalDateTime.now().isAfter(user.getOtpExpiry())){
            throw new RuntimeException("Otp is Expired,Generate new Otp");
        }
        if(!user.getOtp().equals(otpDTO.getOtp())){
            throw new RuntimeException("Invalid Otp");
        }
        User newUser=User.builder()
                .name(user.getName())
                .password(user.getPassword())
                .address(user.getAddress())
                .email(user.getEmail())
                .cnicNumber(user.getCnicNumber())
                .phoneNumber(user.getPhoneNumber())
                .emailVerified(true)
                .build();
        userRepository.save(newUser);
        registrationRequestRepository.deleteById(user.getId());
        return ResponseEntity.ok(Map.of("message","Email verified.After approval you got email"));
    }

    public ResponseEntity<?> sendOtp(OtpDTO otpDTO) throws MessagingException {
        RegistrationRequest user=registrationRequestRepository.findByEmail(otpDTO.getEmail());
        if(user==null){
            throw new RuntimeException("User not found");
        }

            String otp=otpService.generateOtp();
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(15));
            registrationRequestRepository.save(user);
            emailService.sendOtpEmail(otpDTO.getEmail(),otp);


        return ResponseEntity.ok("Otp Send to Email.");
    }

    @Scheduled(fixedRate = 300000)
    public void cleanupExpiredRequests() {
        LocalDateTime expiry = LocalDateTime.now().minusMinutes(30);
        registrationRequestRepository.deleteByCreatedAtBefore(expiry);
    }

    public ResponseEntity<?> signin(SigninDTO signinDTO) {
        User user = userRepository.findByEmail(signinDTO.getEmail());

        if (user == null) {
            throw new UsernameNotFoundException("Invalid email or password");
        }

        switch (user.getStatus()) {
            case PENDING:
                throw new AccountPendingException("Your account is pending. Wait for approval.");

            case DEACTIVATED:
                throw new AccountDeactivatedException("Your account is deactivated.");

            case FREEZE:
                throw new AccountFreezeException("Your account has been frozen. Please contact support.");

            case ACTIVE:
                try{


                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                signinDTO.getEmail(),
                                signinDTO.getPassword()
                        )
                );

                CustomUserDetail userDetails = (CustomUserDetail) authentication.getPrincipal();
                String token=jwtService.generateToken(userDetails.getId(),userDetails.getRole(),userDetails.getEmail());
                ResponseCookie cookie = ResponseCookie.from("access-token", token)
                        .httpOnly(true)      // JavaScript cannot access it
                        .secure(false)        // Use true in production (HTTPS)
                        .path("/")
                        .maxAge(24 * 60 * 60) // 1 day (seconds)
                        .sameSite("Lax")   // or "Lax" / "None"
                        .build();

                return ResponseEntity.ok().header(
                                HttpHeaders.SET_COOKIE,cookie.toString())
                        .body(Map.of("message","User Signin"));
                } catch (BadCredentialsException e) {
                    throw new BadCredentialsException("Invalid Email or Password");
                }
            default:
                throw new DisabledException("Account is not available.");
        }
    }

    public ResponseEntity<?> me() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetail customUserDetail=(CustomUserDetail) authentication.getPrincipal();
        User user=userRepository.findById(customUserDetail.getId()).orElseThrow(null);
        return ResponseEntity.ok(adminService
                .mapUserToResponse(user));
    }

    public ResponseEntity<?> logout(){
        ResponseCookie cookie = ResponseCookie.from("access-token", "")
                .httpOnly(true)      // JavaScript cannot access it
                .secure(false)        // Use true in production (HTTPS)
                .path("/")
                .maxAge(24 * 60 * 60) // 1 day (seconds)
                .sameSite("Lax")   // or "Lax" / "None"
                .build();

        return ResponseEntity.ok().header(
                        HttpHeaders.SET_COOKIE,cookie.toString())
                .body(Map.of("message","Logout Successfully"));
    }
}
