package com.omni_bank.omni_backend.controller;

import com.omni_bank.omni_backend.dto.*;
import com.omni_bank.omni_backend.repository.AccountRepository;
import com.omni_bank.omni_backend.repository.ComplaintRepository;
import com.omni_bank.omni_backend.repository.UserRepository;
import com.omni_bank.omni_backend.service.AdminService;
import com.omni_bank.omni_backend.service.AuthService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;
    private final AuthService authService;
    private static final SecureRandom RANDOM = new SecureRandom();
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final ComplaintRepository complaintRepository;

    @GetMapping("/status")
    public String checkUser(){
        return "Admin Api running";
    }

    @GetMapping("/user/{status}")
    public ResponseEntity<List<UserResponse>> getUsers(@PathVariable String status){
        return adminService.getUsers(status);
    }
    @GetMapping("/accounts/{status}")
    public ResponseEntity<List<AccountResponse>> getAccounts(@PathVariable String status){
        return adminService.getAccounts(status);
    }


    @PutMapping("/user/status")
    public ResponseEntity<?> changeUserStatus(@RequestParam("id") String id,@RequestParam("status")
                                          String status) throws MessagingException {
        return adminService.changeUserStatus(id,status);
    }


    @GetMapping("/user/detail/{id}")
    public ResponseEntity<?> getUserDetail(@PathVariable String id){
        return adminService.getUserDetail(id);
    }


    @GetMapping("/user/matrix")
    public ResponseEntity<UserMetricsProjection> getUserMatrix() {
        UserMetricsProjection metrics = userRepository.getUserStatusMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/account/matrix")
    public ResponseEntity<AccountMatrixProjection> getAccountMatrix() {
        AccountMatrixProjection metrics = accountRepository.getAccountMatrixProjection();
        return ResponseEntity.ok(metrics);
    }
    @GetMapping("/dashboard/matrix")
    public ResponseEntity<?> getDashboardMatrix(){
        return adminService.getDashboardMatrix();
    }
    @GetMapping("/dashboard/weekly-volume")
    public ResponseEntity<?> getWeeklyVolume(){
        return adminService.getWeeklyVolume();
    }
    @GetMapping("/dashboard/weekly-complaints")
    public ResponseEntity<?> getWeeklyComplaintStats() {

        try {

            List<Object[]> result = complaintRepository
                    .getWeeklyComplaintStats();

            Map<String, ComplaintChartResponse> weeklyData = new LinkedHashMap<>();

            weeklyData.put("Mon", new ComplaintChartResponse("Mon", 0L, 0L));
            weeklyData.put("Tue", new ComplaintChartResponse("Tue", 0L, 0L));
            weeklyData.put("Wed", new ComplaintChartResponse("Wed", 0L, 0L));
            weeklyData.put("Thu", new ComplaintChartResponse("Thu", 0L, 0L));
            weeklyData.put("Fri", new ComplaintChartResponse("Fri", 0L, 0L));
            weeklyData.put("Sat", new ComplaintChartResponse("Sat", 0L, 0L));
            weeklyData.put("Sun", new ComplaintChartResponse("Sun", 0L, 0L));

            for (Object[] row : result) {

                String day = ((String) row[0]).substring(0, 3);

                Long resolved = ((Number) row[1]).longValue();
                Long pending = ((Number) row[2]).longValue();

                weeklyData.put(day,
                        new ComplaintChartResponse(day, resolved, pending));
            }

            return ResponseEntity.ok(new ArrayList<>(weeklyData.values()));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }
    }

    @GetMapping("/dashboard/transactions")
    public ResponseEntity<?> getTransactions(){
        return adminService.getTransactions();
    }
}
