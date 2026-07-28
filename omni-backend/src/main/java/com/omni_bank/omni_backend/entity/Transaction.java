package com.omni_bank.omni_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "to_account_id")
    private Account toAccount;
    private BigDecimal amount;
    @Column(length = 1000)
    private String description;
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    @CreationTimestamp
    private LocalDateTime createdAt;
    public void beforeCreation(){
        if (this.type==null){
            this.type= TransactionType.TRANSFER;
        }
    }
}
