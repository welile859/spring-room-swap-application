
package com.codewithwegza.roomswapapplication.Controller;

import com.codewithwegza.roomswapapplication.Services.AuthService;
import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;
import com.codewithwegza.roomswapapplication.dto.LoginRequest;
import com.codewithwegza.roomswapapplication.dto.RegisterRequest;
import org.springframework.security.web.csrf.CsrfToken;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/csrf")
    public CsrfToken getCsrfToken(CsrfToken csrfToken) {
        return csrfToken;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(
            @RequestParam String token) {

        String result = authService.verifyEmail(token);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response) {

        String jwtToken = authService.login(request);

        ResponseCookie cookie = ResponseCookie
                .from("ACCESS_TOKEN", jwtToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofMinutes(10))
                .sameSite("Lax")
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );

        return ResponseEntity.ok("Successfully logged in.");
    }

    @DeleteMapping("/logout")
    public ResponseEntity<String> logout(
            HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie
                .from("ACCESS_TOKEN", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ZERO)
                .sameSite("Lax")
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );

        return ResponseEntity.ok("Successfully logged out.");
    }

    @GetMapping("/me")
    public AuthenticatedUser getCurrentUser(
            Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());

        // We'll implement this lookup in the next step.
        return authService.getAuthenticatedUser(userId);
    }
}
