package com.omni_bank.omni_backend.service;

import com.omni_bank.omni_backend.entity.CustomUserDetail;
import com.omni_bank.omni_backend.entity.User;
import com.omni_bank.omni_backend.repository.UserRepository;
import com.omni_bank.omni_backend.util.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilterService extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = getJwtFromCookies(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            // Subject contains the user ID
            String userId = jwtService.extractSubject(token);

            User user = userRepository.findById(userId)
                    .orElse(null);

            if (user != null && jwtService.isTokenValid(token)) {

                CustomUserDetail userDetails = new CustomUserDetail(user);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("access-token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}
