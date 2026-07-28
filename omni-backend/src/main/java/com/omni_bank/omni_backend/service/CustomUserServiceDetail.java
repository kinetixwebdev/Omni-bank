package com.omni_bank.omni_backend.service;

import com.omni_bank.omni_backend.entity.CustomUserDetail;
import com.omni_bank.omni_backend.entity.User;
import com.omni_bank.omni_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserServiceDetail implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user=userRepository.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("Invalid email or password");
        }
        return new CustomUserDetail(user);
    }
}
