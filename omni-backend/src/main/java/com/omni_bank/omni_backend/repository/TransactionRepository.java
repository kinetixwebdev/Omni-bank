package com.omni_bank.omni_backend.repository;

import com.omni_bank.omni_backend.entity.Account;
import com.omni_bank.omni_backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction,String > {
    List<Transaction> findAllByFromAccount(Account account);

    List<Transaction> findAllByFromAccountOrToAccount(Account fromAccount, Account toAccount);

    @Query(value = """
    SELECT
    DAYNAME(created_at) AS day,
    COALESCE(SUM(amount),0) AS volume
    FROM transaction
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DAYNAME(created_at), DATE(created_at)
    ORDER BY DATE(created_at)
    """, nativeQuery = true)
    List<Object[]> getWeeklyVolume();


    List<Transaction> findAllByToAccount(Account account);
    List<Transaction> findAllByFromAccountOrderByCreatedAtDesc(Account account);


    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t")
    BigDecimal getAmount();

    @Query("""
    SELECT COALESCE(SUM(t.amount),0)
    FROM Transaction t
    WHERE t.createdAt BETWEEN :start AND :end
    """)
    BigDecimal getAmountBetween(LocalDateTime start, LocalDateTime end);
    @Query("""
        SELECT COALESCE(SUM(t.amount),0)
        FROM Transaction t
        WHERE t.toAccount.id = :accountId
        AND t.createdAt >= :startDate
        """)
    BigDecimal getMonthlyIncome(String accountId, LocalDateTime startDate);

    @Query("""
        SELECT COALESCE(SUM(t.amount),0)
        FROM Transaction t
        WHERE t.fromAccount.id = :accountId
        AND t.createdAt >= :startDate
        """)
    BigDecimal getMonthlyExpense(String accountId, LocalDateTime startDate);
    List<Transaction> findTop5ByOrderByCreatedAtDesc();

    @Query("""
SELECT COALESCE(SUM(t.amount),0)
FROM Transaction t
WHERE t.toAccount.id = :accountId
AND t.createdAt >= :start
AND t.createdAt < :end
""")
    BigDecimal getMonthlyIncomeBetween(
            String accountId,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
SELECT COALESCE(SUM(t.amount),0)
FROM Transaction t
WHERE t.fromAccount.id = :accountId
AND t.createdAt >= :start
AND t.createdAt < :end
""")
    BigDecimal getMonthlyExpenseBetween(
            String accountId,
            LocalDateTime start,
            LocalDateTime end
    );
}
