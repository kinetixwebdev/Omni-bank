package com.omni_bank.omni_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {

    private Account fromAccount;
    private Account toAccount;
    private String description;
    private BigDecimal amount;
    private PaymentStatus status;
    private TransactionType transactionType;
}
