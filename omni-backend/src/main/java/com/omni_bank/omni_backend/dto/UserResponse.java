package com.omni_bank.omni_backend.dto;

import com.omni_bank.omni_backend.entity.UserRole;
import com.omni_bank.omni_backend.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String phoneNumber;
    private String cnicNumber;
    private UserStatus status;
    private UserRole role;
    private LocalDateTime createdAt;
    private boolean emailVerified;
}
