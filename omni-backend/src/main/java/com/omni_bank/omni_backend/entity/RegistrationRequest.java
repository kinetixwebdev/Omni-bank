package com.omni_bank.omni_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class RegistrationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String cnicNumber;
    private String address;
    private String otp;
    private LocalDateTime otpExpiry;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
