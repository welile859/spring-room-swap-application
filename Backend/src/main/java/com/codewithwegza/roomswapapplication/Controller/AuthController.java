
package com.codewithwegza.roomswapapplication.Controller;

import com.codewithwegza.roomswapapplication.Services.AuthService;
import com.codewithwegza.roomswapapplication.Services.SessionService;
import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;
import com.codewithwegza.roomswapapplication.dto.LoginRequest;
import com.codewithwegza.roomswapapplication.dto.RegisterRequest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final SessionService sessionService;

    public AuthController(
            AuthService authService,
            SessionService sessionService) {

        this.authService = authService;
        this.sessionService = sessionService;
    }

    @PostMapping("/register")
    public String Register(@RequestBody RegisterRequest registerRequest) {
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

        String sessionId = authService.login(request);

        ResponseCookie cookie = ResponseCookie
                .from("SESSION_ID", sessionId)
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
    public String logout(
            HttpServletRequest logOutRequest,
            HttpServletResponse response) {

        authService.logout(logOutRequest);

        Cookie sessionCookie = new Cookie("SESSION_ID", "");
        sessionCookie.setHttpOnly(true);
        sessionCookie.setPath("/");
        sessionCookie.setMaxAge(0);

        response.addCookie(sessionCookie);

        return "Successfully logged out.";
    }

    // Retrieve currently authenticated user
    @GetMapping("/me")
    public AuthenticatedUser getCurrentUser(
            HttpServletRequest request) {

        return sessionService.getAuthenticatedUser(request);
    }
}
