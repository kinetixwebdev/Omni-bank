package com.omni_bank.omni_backend.repository;

import com.omni_bank.omni_backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface  ComplaintRepository extends JpaRepository<Complaint,String> {
    @Query(value = """
SELECT
    DAYNAME(created_at) AS day,
    SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolved,
    SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending
FROM complaint
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
GROUP BY DAYNAME(created_at), DATE(created_at)
ORDER BY DATE(created_at)
""", nativeQuery = true)
    List<Object[]> getWeeklyComplaintStats();

    long countByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}
