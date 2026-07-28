package com.omni_bank.omni_backend.exception;

public class AccountDeactivatedException extends RuntimeException{
    public AccountDeactivatedException(String message){
        super(message);
    }
}
