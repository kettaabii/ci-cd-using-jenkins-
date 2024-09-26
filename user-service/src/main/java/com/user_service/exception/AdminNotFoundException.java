package com.user_service.exception;

public class AdminNotFoundException extends RuntimeException {
    public AdminNotFoundException(Long id) {
        super(String.format("Admin not found with id: "+id));
    }
}
