package com.omni_bank.omni_backend.repository;

import com.omni_bank.omni_backend.dto.UserMetricsProjection;
import com.omni_bank.omni_backend.entity.User;
import com.omni_bank.omni_backend.entity.UserRole;
import com.omni_bank.omni_backend.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface UserRepository extends JpaRepository<User,String> {
    User findByEmail(String email);
    List<User> findAllByStatus(UserStatus userStatus);

    @Query("""
    SELECT
        SUM(CASE WHEN u.status = 'ACTIVE' THEN 1 ELSE 0 END) as activeCount,
        SUM(CASE WHEN u.status = 'PENDING' THEN 1 ELSE 0 END) as pendingCount,
        SUM(CASE WHEN u.status = 'FREEZE' THEN 1 ELSE 0 END) as freezeCount,
        SUM(CASE WHEN u.status = 'DEACTIVATED' THEN 1 ELSE 0 END) as deactivatedCount,
        SUM(CASE WHEN u.status = 'REJECTED' THEN 1 ELSE 0 END) as rejectedCount
    FROM User u
    WHERE u.role <> 'ADMIN'
""")
    UserMetricsProjection getUserStatusMetrics();
    long countByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}
