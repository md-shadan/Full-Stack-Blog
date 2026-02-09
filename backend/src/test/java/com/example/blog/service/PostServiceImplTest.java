package com.example.blog.service;

import com.example.blog.dto.PostRequest;
import com.example.blog.entity.Post;
import com.example.blog.entity.Role;
import com.example.blog.entity.User;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;
import com.example.blog.security.UserPrincipal;
import com.example.blog.service.impl.PostServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class PostServiceImplTest {

    private PostRepository postRepository;
    private UserRepository userRepository;
    private PostServiceImpl postService;

    @BeforeEach
    void setup() {
        postRepository = Mockito.mock(PostRepository.class);
        userRepository = Mockito.mock(UserRepository.class);
        postService = new PostServiceImpl(postRepository, userRepository);
    }

    @Test
    void create_createsPost() {
        User user = new User("Test", "test@example.com", "pass", Role.USER);
        user.setId(1L);
        UserPrincipal principal = UserPrincipal.from(user);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities()));

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(postRepository.save(any(Post.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PostRequest req = new PostRequest();
        req.setTitle("Hello");
        req.setContent("World");

        com.example.blog.dto.PostResponse response = postService.create(req);
        assertEquals("Hello", response.getTitle());
        assertEquals("Test", response.getAuthorName());
    }
}
