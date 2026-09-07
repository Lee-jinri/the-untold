package com.untold.backend.admin.dto;

import lombok.Getter;

@Getter
public class AdminLoginResponse {
	private final String token;
	
	public AdminLoginResponse(String token) {
        this.token = token;
    }
}
