package com.omni_bank.omni_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RegistrationRequestDTO {
    private String name;
    private String cnicNumber;
    private String phoneNumber;
    private String password;
    private String email;
    private String address;
}
