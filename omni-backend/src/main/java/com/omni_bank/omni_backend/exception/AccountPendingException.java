package com.omni_bank.omni_backend.exception;

public class AccountPendingException extends RuntimeException{
    public AccountPendingException(String message){
        super(message);
    }
}
