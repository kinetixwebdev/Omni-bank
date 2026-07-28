package com.omni_bank.omni_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class TransferDTO {
    private String toAccount;
    private BigDecimal amount;
    private String description;
}
