package com.omni_bank.omni_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class OtpDTO {
    private String email;
    private String otp;
}
