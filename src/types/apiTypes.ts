import type { Post } from './postTypes';

// API 响应类型
export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

// 分页类型
export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
}

// 带分页的帖子列表
export interface PaginatedPosts {
    posts: Post[];
    pagination: Pagination;
}