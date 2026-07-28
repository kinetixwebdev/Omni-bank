package com.omni_bank.omni_backend.repository;

import com.omni_bank.omni_backend.dto.AccountMatrixProjection;
import com.omni_bank.omni_backend.dto.UserMetricsProjection;
import com.omni_bank.omni_backend.entity.Account;
import com.omni_bank.omni_backend.entity.AccountStatus;
import com.omni_bank.omni_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account,String > {

    List<Account> findAllByStatus(AccountStatus accountStatus);

    Account findByUser(User user);

    @Query("SELECT " +
            "SUM(CASE WHEN a.status = 'ACTIVE' THEN 1 ELSE 0 END) as activeCount, " +
            "SUM(CASE WHEN a.status = 'CLOSED' THEN 1 ELSE 0 END) as closedCount, " +
            "SUM(CASE WHEN a.status = 'FREEZE' THEN 1 ELSE 0 END) as freezeCount, " +
            "SUM(CASE WHEN a.status = 'DEACTIVATED' THEN 1 ELSE 0 END) as deactivatedCount " +
            "FROM Account a")
    AccountMatrixProjection getAccountMatrixProjection();

    Optional<Account> findByAccountNumber(String fromAccount);
    long countByStatusAndCreatedAtBetween(
            AccountStatus status,
            LocalDateTime start,
            LocalDateTime end
    );
    Long countByStatus(AccountStatus active);
}
