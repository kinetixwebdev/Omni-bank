package com.omni_bank.omni_backend.service;

import com.omni_bank.omni_backend.dto.*;
import com.omni_bank.omni_backend.entity.*;
import com.omni_bank.omni_backend.repository.AccountRepository;
import com.omni_bank.omni_backend.repository.ComplaintRepository;
import com.omni_bank.omni_backend.repository.TransactionRepository;
import com.omni_bank.omni_backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService{
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final EmailService emailService;
    private final ComplaintRepository complaintRepository;
    private String calculateChange(double current, double previous) {

        if (previous == 0) {
            return current > 0 ? "+100.0%" : "0.0%";
        }

        double percentage = ((current - previous) / previous) * 100;

        return String.format("%+.1f%%", percentage);
    }
    //map to user response

    public UserResponse mapUserToResponse(User user){
        return UserResponse.builder()
                .name(user.getName())
                .id(user.getId())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .role(user.getRole())
                .cnicNumber(user.getCnicNumber())
                .build();
    }

    // map to account response

    private AccountResponse mapAccountToResponse(Account account){
        if (account == null) {
            return null;
        }
        return AccountResponse.builder()
                .id(account.getId())
                .status(account.getStatus())
                .holderName(account.getHolderName())
                .accountNumber(account.getAccountNumber())
                .userId(account.getUser().getId())
                .balance(account.getBalance())
                .createdAt(account.getCreatedAt())
                .build();
    }

    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .toAccountNumber(
                        transaction.getToAccount() != null
                                ? transaction.getToAccount().getAccountNumber()
                                : null
                )
                .toHolderName(
                        transaction.getToAccount() != null
                                ? transaction.getToAccount().getHolderName()
                                : null
                )
                .fromAccountNumber(
                        transaction.getFromAccount() != null
                                ? transaction.getFromAccount().getAccountNumber()
                                : null
                )
                .fromHolderName(
                        transaction.getFromAccount() != null
                                ? transaction.getFromAccount().getHolderName()
                                : null
                )
                .createdAt(transaction.getCreatedAt())
                .description(transaction.getDescription())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .type(transaction.getType())
                .build();
    }


    private static final SecureRandom RANDOM = new SecureRandom();

    // get users from dataBase for admin panel

    public ResponseEntity<List<UserResponse>> getUsers(String status) {
        UserStatus userStatus=UserStatus.valueOf(status.toUpperCase());
        List<User> users=userRepository.findAllByStatus(userStatus);
        return ResponseEntity.ok().body(
                users.stream().map(this::mapUserToResponse).toList()
        );
    }

    // change user status

    public ResponseEntity<?> changeUserStatus(String id, String status) throws MessagingException {
        // Handling standard lookup safely to prevent NullPointerExceptions
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User profile with ID " + id + " not found"));

        switch (status.toLowerCase()) {
            case "activate":
                // Check if user already active to prevent redundant creation
                if (user.getStatus() == UserStatus.ACTIVE) {
                    return ResponseEntity.badRequest().body(Map.of("message", "User profile is already active"));
                }

                // Check if account already exists
                Account exist = accountRepository.findByUser(user);
                if (exist != null) {
                    // If account exists but user was inactive/deactivated, we reactivate without creating a new one
                    user.setStatus(UserStatus.ACTIVE);
                    userRepository.save(user);
                    exist.setStatus(AccountStatus.ACTIVE);
                    accountRepository.save(exist);
                    return ResponseEntity.ok(Map.of("message", "User profile re-activated. Existing account attached."));
                }

                // Standard Generation logic for New Account Number
                StringBuilder accountNumber = new StringBuilder("PK05");
                for (int i = 0; i < 16; i++) {
                    accountNumber.append(RANDOM.nextInt(10));
                }

                Account account = Account.builder()
                        .user(user)
                        .holderName(user.getName())
                        .accountNumber(accountNumber.toString())
                        .balance(BigDecimal.valueOf(100))
                        .status(AccountStatus.ACTIVE) // Initializing account status
                        .build();

                accountRepository.save(account);
                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);

                // Asynchronous or direct transactional mailer invocation
                emailService.sendAccountApprovedEmail(user.getEmail());
                return ResponseEntity.ok(Map.of("message", "User Activated Successfully "));

            case "deactivate":
                user.setStatus(UserStatus.DEACTIVATED);
                userRepository.save(user);
                Account userAccountToDeactivate = accountRepository.findByUser(user);
                if (userAccountToDeactivate != null) {
                    userAccountToDeactivate.setStatus(AccountStatus.DEACTIVATED);
                    accountRepository.save(userAccountToDeactivate);
                }
                return ResponseEntity.ok(Map.of("message", "User profile deactivated "));

            case "freeze":
                user.setStatus(UserStatus.FREEZE);
                userRepository.save(user);
                // Checking and freezing associated financial assets
                Account userAccountToFreeze = accountRepository.findByUser(user);
                if (userAccountToFreeze != null) {
                    userAccountToFreeze.setStatus(AccountStatus.FREEZE);
                    accountRepository.save(userAccountToFreeze);
                }
                return ResponseEntity.ok(Map.of("message", "User profile Freeze"));

            case "unfreeze":
                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);

                // Restoring access to the financial architecture
                Account userAccountToUnfreeze = accountRepository.findByUser(user);
                if (userAccountToUnfreeze != null) {
                    userAccountToUnfreeze.setStatus(AccountStatus.ACTIVE);
                    accountRepository.save(userAccountToUnfreeze);
                }
                return ResponseEntity.ok(Map.of("message", "User profile Activated"));

            case "rejected":
                user.setStatus(UserStatus.REJECTED);
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "User application rejected successfully"));

            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Invalid administrative workflow state target: " + status));
        }
    }

    // get Accounts
    public ResponseEntity<List<AccountResponse>> getAccounts(String status) {
        AccountStatus accountStatus= AccountStatus.valueOf(status.toUpperCase());
        List<Account> accounts=accountRepository.findAllByStatus(accountStatus);
        return ResponseEntity.ok().body(
                accounts.stream().map(this::mapAccountToResponse).toList()
        );
    }


    //get user-detail through id

    public ResponseEntity<?> getUserDetail(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findByUser(user);

        List<Transaction> transactions = account == null
                ? Collections.emptyList()
                : transactionRepository.findAllByFromAccountOrToAccount(account,account);

        Map<String, Object> response = new HashMap<>();
        response.put("userDetail", mapUserToResponse(user));
        response.put("accountDetail", account == null ? null : mapAccountToResponse(account));
        response.put("transactions", transactions.stream().map(this::mapToTransactionResponse).toList());

        return ResponseEntity.ok(response);
    }


    public ResponseEntity<?> getDashboardMatrix() {

        LocalDate today = LocalDate.now();

        LocalDateTime currentStart = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime currentEnd = LocalDateTime.now();

        LocalDate lastMonth = today.minusMonths(1);

        LocalDateTime previousStart = lastMonth.withDayOfMonth(1).atStartOfDay();
        LocalDateTime previousEnd = lastMonth
                .withDayOfMonth(lastMonth.lengthOfMonth())
                .atTime(23, 59, 59);

        try {

            // ================= TOTAL VALUES =================

            Long totalUsers = userRepository.count();
            Long activeUsers = accountRepository.countByStatus(AccountStatus.ACTIVE);
            Long complaints = complaintRepository.count();
            BigDecimal totalVolume = transactionRepository.getAmount();

            // ================= USERS =================

            long currentUsers = userRepository.countByCreatedAtBetween(currentStart, currentEnd);

            long previousUsers = userRepository.countByCreatedAtBetween(previousStart, previousEnd);

            String userChange = calculateChange(currentUsers, previousUsers);
            boolean userPositive = currentUsers >= previousUsers;

            // ================= ACTIVE ACCOUNTS =================

            long currentActiveAccounts =
                    accountRepository.countByStatusAndCreatedAtBetween(
                            AccountStatus.ACTIVE,
                            currentStart,
                            currentEnd
                    );

            long previousActiveAccounts =
                    accountRepository.countByStatusAndCreatedAtBetween(
                            AccountStatus.ACTIVE,
                            previousStart,
                            previousEnd
                    );

            String activeAccountChange =
                    calculateChange(currentActiveAccounts, previousActiveAccounts);

            boolean activePositive =
                    currentActiveAccounts >= previousActiveAccounts;

            // ================= COMPLAINTS =================

            long currentComplaints =
                    complaintRepository.countByCreatedAtBetween(
                            currentStart,
                            currentEnd
                    );

            long previousComplaints =
                    complaintRepository.countByCreatedAtBetween(
                            previousStart,
                            previousEnd
                    );

            String complaintChange =
                    calculateChange(currentComplaints, previousComplaints);

            // Fewer complaints is better
            boolean complaintPositive =
                    currentComplaints <= previousComplaints;

            // ================= TRANSACTIONS =================

            BigDecimal currentVolume =
                    transactionRepository.getAmountBetween(
                            currentStart,
                            currentEnd
                    );

            BigDecimal previousVolume =
                    transactionRepository.getAmountBetween(
                            previousStart,
                            previousEnd
                    );

            String volumeChange =
                    calculateChange(
                            currentVolume.doubleValue(),
                            previousVolume.doubleValue()
                    );

            boolean volumePositive =
                    currentVolume.compareTo(previousVolume) >= 0;

            // ================= RESPONSE =================

            List<DashboardStatsResponse> stats = List.of(

                    DashboardStatsResponse.builder()
                            .title("Total System Volume")
                            .value("Rs " + totalVolume)
                            .change(volumeChange)
                            .isPositive(volumePositive)
                            .build(),

                    DashboardStatsResponse.builder()
                            .title("Total Registered Users")
                            .value(totalUsers.toString())
                            .change(userChange)
                            .isPositive(userPositive)
                            .build(),

                    DashboardStatsResponse.builder()
                            .title("Complaints")
                            .value(complaints.toString())
                            .change(complaintChange)
                            .isPositive(complaintPositive)
                            .build(),

                    DashboardStatsResponse.builder()
                            .title("Active Accounts")
                            .value(activeUsers.toString())
                            .change(activeAccountChange)
                            .isPositive(activePositive)
                            .build()
            );

            return ResponseEntity.ok(stats);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to fetch dashboard statistics",
                            "error", e.getMessage()
                    ));
        }
    }

    public ResponseEntity<?> getWeeklyVolume() {

        try {

            List<Object[]> result = transactionRepository.getWeeklyVolume();

            // Initialize all days with 0
            Map<String, BigDecimal> weeklyData = new LinkedHashMap<>();
            weeklyData.put("Mon", BigDecimal.ZERO);
            weeklyData.put("Tue", BigDecimal.ZERO);
            weeklyData.put("Wed", BigDecimal.ZERO);
            weeklyData.put("Thu", BigDecimal.ZERO);
            weeklyData.put("Fri", BigDecimal.ZERO);
            weeklyData.put("Sat", BigDecimal.ZERO);
            weeklyData.put("Sun", BigDecimal.ZERO);

            // Replace days that exist in database
            for (Object[] row : result) {
                String day = ((String) row[0]).substring(0, 3);
                BigDecimal volume = (BigDecimal) row[1];

                weeklyData.put(day, volume);
            }

            List<VolumeChartResponse> response = weeklyData.entrySet()
                    .stream()
                    .map(entry -> new VolumeChartResponse(
                            entry.getKey(),
                            entry.getValue()
                    ))
                    .toList();

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to fetch weekly volume.",
                            "error", e.getMessage()
                    ));
        }
    }



    public ResponseEntity<?> getTransactions() {
        List<Transaction> latestTransactions =
                transactionRepository.findTop5ByOrderByCreatedAtDesc();
        return ResponseEntity.ok(latestTransactions.stream().map(this::mapToTransactionResponse).toList());
    }
}


