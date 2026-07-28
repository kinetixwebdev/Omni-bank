package com.omni_bank.omni_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ComplaintChartResponse {
    private String day;
    private long resolved;
    private long pending;
}
