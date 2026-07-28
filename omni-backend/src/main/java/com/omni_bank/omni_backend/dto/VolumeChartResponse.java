package com.omni_bank.omni_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VolumeChartResponse {

    private String day;
    private BigDecimal volume;
}