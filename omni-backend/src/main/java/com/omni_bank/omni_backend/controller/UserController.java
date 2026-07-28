package com.omni_bank.omni_backend.controller;

import com.omni_bank.omni_backend.dto.DashboardMatrix;
import com.omni_bank.omni_backend.dto.MonthlyStatsDto;
import com.omni_bank.omni_backend.dto.TransferDTO;
import com.omni_bank.omni_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@PreAuthorize("hasRole('USER')")
public class UserController {
    private final UserService userService;

    @GetMapping("/status")
    public String checkUser(){
        return "User Api running";
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(@RequestBody TransferDTO transferDTO){
        return userService.transferMoney(transferDTO);
    }
    @GetMapping("/transaction/recent/recipients")
    public ResponseEntity<?>getRecentRecipients(){
        return userService.getRecentRecipients();
    }
    @GetMapping("/account-detail")
    public ResponseEntity<?>getAccountDetail(){
        return userService.getAccountDetail();
    }
    @GetMapping("/transactions")
    public ResponseEntity<?>getTransactions(){
        return userService.getTransactions();
    }
    @GetMapping("/dashboard/matrix")
    public ResponseEntity<DashboardMatrix> getDashboardMatrix(){
        return userService.getDashboardMatrix();
    }
    @GetMapping("/dashboard/chart")
    public ResponseEntity<List<MonthlyStatsDto>> getChartData() {
        return ResponseEntity.ok(userService.getExpenseData());
    }
    @GetMapping("/account/name/{accountNumber}")
    public ResponseEntity<?>getAccountName(@PathVariable String accountNumber){
        return userService.getAccountName(accountNumber);
    }

}
