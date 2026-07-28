package com.omni_bank.omni_backend.dto;

import com.omni_bank.omni_backend.entity.PaymentStatus;
import com.omni_bank.omni_backend.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    private String toAccountNumber;
    private String toHolderName;
    private String fromAccountNumber;
    private String fromHolderName;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private String description;
    private TransactionType type;
    private PaymentStatus status;

}
