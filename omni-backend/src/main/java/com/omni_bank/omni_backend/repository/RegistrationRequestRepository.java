package com.omni_bank.omni_backend.repository;

import com.omni_bank.omni_backend.entity.RegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest,String> {
    void deleteByCreatedAtBefore(LocalDateTime time);

    RegistrationRequest findByEmail(String email);
}
