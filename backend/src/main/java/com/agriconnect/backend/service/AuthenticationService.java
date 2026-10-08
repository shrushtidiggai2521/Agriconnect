package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.LoginRequest;
import com.agriconnect.backend.dto.LoginResponse;
import com.agriconnect.backend.dto.RegisterRequest;

public interface AuthenticationService {

    LoginResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
