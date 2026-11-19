package com.codewithwegza.roomswapapplication.Services;

import com.codewithwegza.roomswapapplication.Models.Sessions;
import com.codewithwegza.roomswapapplication.Models.Users;
import com.codewithwegza.roomswapapplication.Repository.SessionRepo;
import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Service
public class SessionService {

    private final SessionRepo sessionRepository;

    // Inject the repository so we can search for sessions in the database.
    public SessionService(SessionRepo  sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Transactional(readOnly = true)
    public AuthenticatedUser getAuthenticatedUser(HttpServletRequest request) {

        // Step 1: Get the cookies sent by the browser.
        Cookie[] cookies = request.getCookies();

        // If there are no cookies, the user is not authenticated.
        if (cookies == null) {
            throw new RuntimeException("Authentication required.");
        }

        String sessionToken = null;

        // Step 2: Find the SESSION_ID cookie.
        for (Cookie cookie : cookies) {
            if ("SESSION_ID".equals(cookie.getName())) {
                sessionToken = cookie.getValue();
                break;
            }
        }

        // If the SESSION_ID cookie is missing or empty, reject the request.
        if (sessionToken == null || sessionToken.isBlank()) {
            throw new RuntimeException("Authentication required.");
        }

        // Step 3: Hash the raw token using the same algorithm used
        // when the session was originally created.
        String tokenHash = hashToken(sessionToken);

        // Step 4: Find the session using its stored token hash.
        Optional<Sessions> optionalSession =
                sessionRepository.findBySessionTokenHash(tokenHash);

        // Reject the request if the session does not exist.
        if (optionalSession.isEmpty()) {
            throw new RuntimeException("Invalid session.");
        }

        Sessions session = optionalSession.get();

        // Step 5: Check whether the session has been revoked.
        if (session.getRevokedAt() != null) {
            throw new RuntimeException("Session has been revoked.");
        }

        // Step 6: Check whether the session has expired.
        if (session.getExpiresAt() == null ||
                !session.getExpiresAt().isAfter(Instant.now())) {
            throw new RuntimeException("Session has expired.");
        }

        // Step 7: Return the user associated with this valid session.
        // The user ID comes from the database, not from the frontend.
        Users user = session.getUser();

        return new AuthenticatedUser(
                user.getUserId(),
                user.getFullName()
        );
    }

    // Hash the token so we can compare it with the hash stored in PostgreSQL.
    private String hashToken(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hashedBytes = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            // Convert the hash to a Base64 URL-safe string without padding.
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(hashedBytes);

        } catch (NoSuchAlgorithmException exception) {
            // SHA-256 is supported by standard Java implementations.
            throw new IllegalStateException(
                    "SHA-256 algorithm is unavailable.", exception
            );
        }
    }
}