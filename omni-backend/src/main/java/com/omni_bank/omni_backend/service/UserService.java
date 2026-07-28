package com.omni_bank.omni_backend.service;

import com.omni_bank.omni_backend.dto.*;
import com.omni_bank.omni_backend.entity.*;
import com.omni_bank.omni_backend.exception.AccountNotFoundException;
import com.omni_bank.omni_backend.exception.InsufficientBalanceException;
import com.omni_bank.omni_backend.repository.AccountRepository;
import com.omni_bank.omni_backend.repository.TransactionRepository;
import com.omni_bank.omni_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AdminService adminService;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;


    private User getCurrentUser(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetail customUserDetail=(CustomUserDetail) authentication.getPrincipal();
        User user=userRepository.findById(customUserDetail.getId()).orElseThrow(null);
        return user;
    }
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

    public RecipientsResponse mapTransactionToResponse(Transaction transaction){
        return RecipientsResponse.builder()
                .name(transaction.getToAccount() != null
                        ? transaction.getToAccount().getHolderName()
                        : null)
                .accountNumber(transaction.getToAccount() != null
                        ? transaction.getToAccount().getAccountNumber()
                        : null)
                .build();
    }
    @Transactional
    public ResponseEntity<?> transferMoney(TransferDTO transferDTO) {

        Transaction transaction = new Transaction();

        try {
            Account toAccount = accountRepository.findByAccountNumber(transferDTO.getToAccount())
                    .orElseThrow(() -> new AccountNotFoundException("Invalid Account Number"));

            User user = getCurrentUser();
            Account fromAccount = accountRepository.findByUser(user);

            if (fromAccount == null) {
                throw new AccountNotFoundException("Your account does not exist");
            }

            if (fromAccount.getBalance().compareTo(transferDTO.getAmount()) < 0) {
                throw new InsufficientBalanceException("Insufficient Balance");
            }

            // Debit sender
            fromAccount.setBalance(
                    fromAccount.getBalance().subtract(transferDTO.getAmount())
            );

            // Credit receiver
            toAccount.setBalance(
                    toAccount.getBalance().add(transferDTO.getAmount())
            );

            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
            transaction.setType(TransactionType.TRANSFER);
            transaction.setFromAccount(fromAccount);
            transaction.setToAccount(toAccount);
            transaction.setAmount(transferDTO.getAmount());
            transaction.setDescription(transferDTO.getDescription());
            transaction.setStatus(PaymentStatus.SUCCESS);

            transactionRepository.save(transaction);

            return ResponseEntity.ok(
                    Map.of("message", "Money transferred successfully")
            );

        } catch (Exception e) {

            transaction.setAmount(transferDTO.getAmount());
            transaction.setDescription(transferDTO.getDescription());
            transaction.setStatus(PaymentStatus.FAILED);

            transactionRepository.save(transaction);

            throw e;
        }
    }


    public ResponseEntity<?> getTransactions(){

        User user=getCurrentUser();
        Account account=accountRepository.findByUser(user);
        List<Transaction> transactions =
                transactionRepository.findAllByFromAccountOrderByCreatedAtDesc(account);
        return ResponseEntity.ok((transactions.stream().map(this::mapToTransactionResponse).toList()));
    }


    public ResponseEntity<DashboardMatrix>  getDashboardMatrix() {
        User user=getCurrentUser();
        Account account=accountRepository.findByUser(user);
        LocalDateTime startOfMonth =
                LocalDate.now().withDayOfMonth(1).atStartOfDay();

        BigDecimal income =
                transactionRepository.getMonthlyIncome(account.getId(), startOfMonth);

        BigDecimal expense =
                transactionRepository.getMonthlyExpense(account.getId(), startOfMonth);

        return ResponseEntity.ok(new DashboardMatrix(
                "Rs" + income,
                "Rs" + expense,
                "+12.4% vs last month",      // calculate later
                "37% of monthly budget spent" // calculate later)
        ));
    }

    public ResponseEntity<?> getRecentRecipients() {

        User user = getCurrentUser();
        Account account = accountRepository.findByUser(user);

        List<RecipientsResponse> recipients = transactionRepository
                .findAllByFromAccountOrderByCreatedAtDesc(account)
                .stream()
                .collect(Collectors.toMap(
                        transaction -> transaction.getToAccount().getId(), // unique recipient
                        this::mapTransactionToResponse,
                        (existing, replacement) -> existing, // first (latest) one
                        LinkedHashMap::new
                ))
                .values()
                .stream()
                .toList();

        return ResponseEntity.ok(recipients);
    }

    public ResponseEntity<?> getAccountName(String accountNumber) {

        Account account = accountRepository.findByAccountNumber(accountNumber).orElseThrow();

        if (account == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Account not found"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "name", account.getHolderName()
                )
        );
    }
    public List<MonthlyStatsDto> getExpenseData() {

        User user = getCurrentUser();
        Account account = accountRepository.findByUser(user);

        List<MonthlyStatsDto> result = new ArrayList<>();

        int year = LocalDate.now().getYear();

        for (int month = 1; month <= 7; month++) {

            LocalDateTime start = LocalDate.of(year, month, 1).atStartOfDay();
            LocalDateTime end = start.plusMonths(1);

            BigDecimal income = transactionRepository.getMonthlyIncomeBetween(
                    account.getId(), start, end);

            BigDecimal expense = transactionRepository.getMonthlyExpenseBetween(
                    account.getId(), start, end);

            result.add(new MonthlyStatsDto(
                    start.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    income,
                    expense
            ));
        }

        return result;
    }

    public ResponseEntity<?> getAccountDetail() {
        User user=getCurrentUser();
        Account account=accountRepository.findByUser(user);
        return ResponseEntity.ok(mapAccountToResponse(account));
    }
}
