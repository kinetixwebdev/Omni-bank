package com.omni_bank.omni_backend.dto;

public interface UserMetricsProjection {
    long getActiveCount();
    long getPendingCount();
    long getFreezeCount();
    long getDeactivatedCount();
    long getRejectedCount();
}