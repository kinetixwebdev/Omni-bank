package com.omni_bank.omni_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardMatrix {
    private String monthlyIncome;
    private String monthlyExpenses;
    private String incomeChange;
    private String expenseChange;
}
