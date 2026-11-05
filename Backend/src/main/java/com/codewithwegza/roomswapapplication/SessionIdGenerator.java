package com.codewithwegza.roomswapapplication;

import java.security.SecureRandom;
import java.util.Base64;

public class SessionIdGenerator {

    private static final SecureRandom secureRandom =
            new SecureRandom();

    public static String generateSessionId() {

        byte[] randomBytes = new byte[32];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }
}

