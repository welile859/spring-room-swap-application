package com.codewithwegza.roomswapapplication.Services;
import com.codewithwegza.roomswapapplication.Models.Sessions;
import com.codewithwegza.roomswapapplication.Models.Token;
import com.codewithwegza.roomswapapplication.Models.Users;
import com.codewithwegza.roomswapapplication.Repository.SessionRepo;
import com.codewithwegza.roomswapapplication.Repository.TokenRepo;
import com.codewithwegza.roomswapapplication.dto.LoginRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.codewithwegza.roomswapapplication.SessionIdGenerator;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import com.codewithwegza.roomswapapplication.Repository.UserRepo;
import com.codewithwegza.roomswapapplication.dto.RegisterRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    UserRepo userRepo;
    MailService emailService;
    TokenRepo tokenRepo;
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    SessionRepo sessionRepo;


    public AuthService(UserRepo userRepo, TokenRepo tokenRepo, MailService emailService, SessionRepo sessionRepo){
        this.userRepo = userRepo;
        this.emailService= emailService;
        this.tokenRepo = tokenRepo;
        this.sessionRepo = sessionRepo;

    }

    // Hashes a raw session ID using SHA-256.
    private String hashToken(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hashedBytes = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            // Convert the hash into a URL-safe Base64 string.
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(hashedBytes);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 algorithm is unavailable.",
                    exception
            );
        }
    }

    public String register(RegisterRequest registerRequest){

        //Checks whether email exists in the database.
        if(userRepo.existsByEmail(registerRequest.getEmail())){

            return("Email: " + registerRequest.getEmail() +" already exists.");

        }


         // Case when database does not exist.
        Users newUsers = new Users();

        newUsers.setFullName(registerRequest.getFullName());

        newUsers.setEmail(registerRequest.getEmail());

        newUsers.setHashedPassword(encoder.encode(registerRequest.getPassword()));

        newUsers.setIsVerified(false);

        userRepo.save(newUsers);

        //Create unique verification token

        Token assignedToken = new Token();

        String token = UUID.randomUUID().toString();

        assignedToken.setTokenString(token);

        tokenRepo.save(assignedToken);

        emailService.sendEmail(registerRequest.getEmail(), token );

        return "success";

    }

    public String verifyEmail(String token){

        Optional<Token> token1 = tokenRepo.findByTokenString(token);

        //Look Up token in from token repo
        if(tokenRepo.existsByTokenString(token)){

            Instant now = Instant.now();

            if(token1.get().getExpiryTime().isAfter(now)){
                return "Token has expired.";
            }

            Users user = token1.get().getUsers();

            user.setIsVerified(true);

            userRepo.save(user);

            return "Account verified.";

        }

        return "Token does not exist.";

    }

    public String login(LoginRequest request) {

        // Check whether the user exists.
        if (!userRepo.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password."
            );
        }

        Users user = userRepo.findByEmail(request.getEmail());

        // Check the entered password against the stored BCrypt hash.
        if (!encoder.matches(
                request.getPassword(),
                user.getHashedPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password."
            );
        }

        // Generate the raw session ID after successful authentication.
        String sessionId = SessionIdGenerator.generateSessionId();

        // Hash the session ID before storing it in the database.
        String sessionTokenHash = hashToken(sessionId);

        // Create the database session.
        Sessions session = new Sessions();
        session.setUser(user);
        session.setSession_token_hash(sessionTokenHash);
        session.setExpiresAt(Instant.now().plusSeconds(600));
        session.setRevokedAt(null);

        // Save the hashed token, not the raw session ID.
        sessionRepo.save(session);

        // Return the raw session ID so the controller can set the cookie.
        return sessionId;
    }

    public void logout(HttpServletRequest logOutRequest) {

        // Read the cookies sent by the browser.
        Cookie[] cookies = logOutRequest.getCookies();

        String sessionId = null;

        // Find the SESSION_ID cookie.
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("SESSION_ID".equals(cookie.getName())) {
                    sessionId = cookie.getValue();
                    break;
                }
            }
        }

        // If no session cookie exists, there is nothing to revoke.
        if (sessionId == null || sessionId.isBlank()) {
            return;
        }

        // Hash the raw session ID to match the database value.
        String sessionTokenHash = hashToken(sessionId);

        // Find the session using its hash.
        Optional<Sessions> session =
                sessionRepo.findBySessionTokenHash(sessionTokenHash);

        // If the session doesn't exist, there is nothing to revoke.
        if (session.isEmpty()) {
            return;
        }

        Sessions userSession = session.get();

        // Revoke the session if it hasn't already been revoked.
        if (userSession.getRevokedAt() == null) {
            userSession.setRevokedAt(Instant.now());
            sessionRepo.save(userSession);
        }
    }



}
