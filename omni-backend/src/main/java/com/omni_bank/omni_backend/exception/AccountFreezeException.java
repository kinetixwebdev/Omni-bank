package com.omni_bank.omni_backend.exception;

public class AccountFreezeException extends RuntimeException{
    public AccountFreezeException(String message){
        super(message);
    }
}
