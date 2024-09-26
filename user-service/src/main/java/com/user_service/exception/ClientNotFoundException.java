package com.user_service.exception;

public class ClientNotFoundException extends RuntimeException {
    public ClientNotFoundException(Long id) {
        super(String.format("Client not found with :"+id));
    }
}
