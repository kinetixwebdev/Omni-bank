package com.omni_bank.omni_backend.util;

import com.omni_bank.omni_backend.entity.UserRole;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {
    public String generateToken(String id, UserRole role,String email){
        return Jwts.builder()
                .claim("email",email)
                .subject(id)
                .claim("roles", role.name())
                .signWith(generateKey())
                .expiration(new Date(new Date().getTime()+60*1000*60*24))
                .issuedAt(new Date())
                .compact();
    }

    public SecretKey generateKey() {
        String secretKey = "NskyU0JuMIkyhciVCIc7moxz17dtJHOrnjIAhsTKB7c=";

        byte[] keyBytes = Base64.getDecoder().decode(secretKey);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractSubject(String token) {
        return Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(generateKey())
                    .build()
                    .parseSignedClaims(token);

            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
