package com.omni_bank.omni_backend.dto;

public interface AccountMatrixProjection {
    long getFreezeCount();
    long getDeactivatedCount();
    long getActiveCount();
    long getClosedCount();

}
