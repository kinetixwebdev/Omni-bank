package com.omni_bank.omni_backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Getter
@Setter

public class CustomUserDetail implements UserDetails {
    private String id;
    private String email;
    private String password;
    private UserRole role;
    public CustomUserDetail(User user){
        this.id= user.getId();;
        this.email= user.getEmail();
        this.password=user.getPassword();
        this.role=user.getRole();
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_"+this.role));
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
