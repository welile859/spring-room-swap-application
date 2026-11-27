
package com.codewithwegza.roomswapapplication.Services;

import com.codewithwegza.roomswapapplication.dto.AuthenticatedUser;
import com.codewithwegza.roomswapapplication.Models.Token;
import com.codewithwegza.roomswapapplication.Models.Users;
import com.codewithwegza.roomswapapplication.Repository.TokenRepo;
import com.codewithwegza.roomswapapplication.Repository.UserRepo;
import com.codewithwegza.roomswapapplication.dto.LoginRequest;
import com.codewithwegza.roomswapapplication.dto.RegisterRequest;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepo userRepo;
    private final MailService emailService;
    private final TokenRepo tokenRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtService jwtService;

    public AuthService(
            UserRepo userRepo,
            TokenRepo tokenRepo,
            MailService emailService,
            JwtService jwtService) {

        this.userRepo = userRepo;
        this.emailService = emailService;
        this.tokenRepo = tokenRepo;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest registerRequest) {

        // Check whether the email already exists.
        if (userRepo.existsByEmail(registerRequest.getEmail())) {
            return "Email: " + registerRequest.getEmail() + " already exists.";
        }

        Users newUsers = new Users();

        newUsers.setFullName(registerRequest.getFullName());
        newUsers.setEmail(registerRequest.getEmail());
        newUsers.setHashedPassword(encoder.encode(registerRequest.getPassword()));
        newUsers.setIsVerified(false);

        userRepo.save(newUsers);

        // Create unique email verification token.
        Token assignedToken = new Token();

        String token = UUID.randomUUID().toString();

        assignedToken.setTokenString(token);

        tokenRepo.save(assignedToken);

        emailService.sendEmail(registerRequest.getEmail(), token);

        return "success";
    }

    public AuthenticatedUser getAuthenticatedUser(Long userId) {

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."
                ));

        return new AuthenticatedUser(
                user.getUserId(),
                user.getFullName(),
                user.getEmail()
        );
    }

    public String verifyEmail(String token) {

        Optional<Token> token1 = tokenRepo.findByTokenString(token);

        if (tokenRepo.existsByTokenString(token)) {

            Instant now = Instant.now();

            if (token1.get().getExpiryTime().isAfter(now)) {
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

        // Generate a JWT after successful authentication.
        return jwtService.generateToken(user.getUserId());
    }
}

