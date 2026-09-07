package com.untold.backend.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.untold.backend.admin.dto.AdminLoginRequest;
import com.untold.backend.admin.dto.AdminLoginResponse;
import com.untold.backend.admin.security.JwtUtil;
import com.untold.backend.common.exception.UnauthorizedException;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminAuthController {
	private final JwtUtil jwtUtil;
	
	@Value("${admin.password}")
    private String adminPassword;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
    	if (!adminPassword.equals(request.getPassword())) {
            throw new UnauthorizedException("잘못된 비밀번호 입니다.");
        }

        String token = jwtUtil.generateToken();
        return ResponseEntity.ok(new AdminLoginResponse(token));
    }
}
