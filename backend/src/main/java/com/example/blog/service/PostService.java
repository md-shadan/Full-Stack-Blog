package com.example.blog.service;

import com.example.blog.dto.PagedResponse;
import com.example.blog.dto.PostRequest;
import com.example.blog.dto.PostResponse;

public interface PostService {
    PagedResponse<PostResponse> getAll(int page, int size, String sort, String search);
    PostResponse getById(Long id);
    PostResponse create(PostRequest request);
    PostResponse update(Long id, PostRequest request);
    void delete(Long id);
}
