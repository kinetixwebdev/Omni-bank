package com.omni_bank.omni_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class DashboardStatsResponse {
    private String title;
    private String value;
    private String change;
    private boolean isPositive;
}
