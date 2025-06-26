package com.example.demo.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.example.demo.services.auth.CustomUserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.StringUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;

public class JWTAuthFilter extends OncePerRequestFilter {
    private final JwtConfig jwtConfig;
    private final CustomUserDetailsService userDetailsService;

    public JWTAuthFilter(JwtConfig jwtConfig, CustomUserDetailsService userDetailsService) {
        this.jwtConfig = jwtConfig;
        this.userDetailsService = userDetailsService;
    }

    // public JWTAuthFilter(JwtConfig jwtConfig, AuthService authService) {
    // this.jwtConfig = jwtConfig;
    // this.authService = authService;
    // }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("=== JWT Filter Processing Request ===");
        System.out.println("Request URI: " + request.getRequestURI());
        
        // Skip authentication for auth endpoints
        if (request.getRequestURI().startsWith("/api/auth")) {
            System.out.println("Skipping authentication for auth endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        String token = getJWTFromRequest(request);
        System.out.println("Token present: " + (token != null));
        
        if (StringUtils.hasText(token)) {
            try {
                String email = jwtConfig.extractUsername(token);
                System.out.println("Extracted email from token: " + email);
                
                UserDetails user = userDetailsService.loadUserByUsername(email);
                System.out.println("User found: " + (user != null));
                
                if (jwtConfig.validateToken(token, user)) {
                    System.out.println("Token validation successful");
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            user, null, user.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                } else {
                    System.out.println("Token validation failed");
                }
            } catch (Exception e) {
                System.err.println("Error processing token: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("No token found in request");
        }
        
        System.out.println("=== JWT Filter Processing Complete ===");
        filterChain.doFilter(request, response);
    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }

}
