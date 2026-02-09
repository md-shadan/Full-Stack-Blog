package com.example.blog.service.impl;

import com.example.blog.dto.PagedResponse;
import com.example.blog.dto.PostRequest;
import com.example.blog.dto.PostResponse;
import com.example.blog.entity.Post;
import com.example.blog.entity.Role;
import com.example.blog.entity.User;
import com.example.blog.exception.ResourceNotFoundException;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;
import com.example.blog.security.UserPrincipal;
import com.example.blog.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostServiceImpl(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Override
    public PagedResponse<PostResponse> getAll(int page, int size, String sort, String search) {
        Sort sortBy = Sort.by("createdAt").descending();
        if (sort != null && sort.equalsIgnoreCase("oldest")) {
            sortBy = Sort.by("createdAt").ascending();
        }
        PageRequest pageable = PageRequest.of(page, size, sortBy);
        Page<Post> posts;
        if (search != null && !search.isBlank()) {
            posts = postRepository.findByTitleContainingIgnoreCase(search, pageable);
        } else {
            posts = postRepository.findAll(pageable);
        }
        List<PostResponse> content = posts.getContent().stream().map(this::mapToResponse).collect(Collectors.toList());
        return new PagedResponse<>(content, posts.getNumber(), posts.getSize(), posts.getTotalElements(),
                posts.getTotalPages(), posts.isLast());
    }

    @Override
    public PostResponse getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return mapToResponse(post);
    }

    @Override
    public PostResponse create(PostRequest request) {
        UserPrincipal principal = currentUser();
        User author = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = new Post(request.getTitle(), request.getContent(), author);
        Post saved = postRepository.save(post);
        return mapToResponse(saved);
    }

    @Override
    public PostResponse update(Long id, PostRequest request) {
        UserPrincipal principal = currentUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        if (!isOwnerOrAdmin(principal, post)) {
            throw new ResourceNotFoundException("Post not found");
        }
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        Post saved = postRepository.save(post);
        return mapToResponse(saved);
    }

    @Override
    public void delete(Long id) {
        UserPrincipal principal = currentUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        if (!isOwnerOrAdmin(principal, post)) {
            throw new ResourceNotFoundException("Post not found");
        }
        postRepository.delete(post);
    }

    private UserPrincipal currentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private boolean isOwnerOrAdmin(UserPrincipal principal, Post post) {
        boolean isOwner = post.getAuthor().getId().equals(principal.getId());
        boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_" + Role.ADMIN.name()));
        return isOwner || isAdmin;
    }

    private PostResponse mapToResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getId(),
                post.getAuthor().getName(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
