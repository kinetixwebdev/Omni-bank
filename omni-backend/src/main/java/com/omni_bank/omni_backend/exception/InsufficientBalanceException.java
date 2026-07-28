package com.omni_bank.omni_backend.exception;

public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message){
        super(message);
    }
}
