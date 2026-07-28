package com.omni_bank.omni_backend.dto;

import com.omni_bank.omni_backend.entity.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountResponse {
    private String id;
    private String holderName;
    private AccountStatus status;
    private String accountNumber;
    private String userId;
    private BigDecimal balance;
    private LocalDateTime createdAt;
}
