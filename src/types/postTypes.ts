import type { User } from './userTypes';

// 核心帖子类型
export interface Post {
    id: number;
    title: string;
    content: string;
    content_summary?: string;  // 设置为可选字段
    slug: string;
    created_at: string;  // 修改字段名以匹配后端
    updated_at: string;  // 新增字段
    author: {
        id: number;
        username: string;
        nickname?: string;  // 修改为可选字段
        bio?: string;       // 新增字段，个人简介
        // 添加这两个字段并确保它们是number类型
        post_count?: number;
        tag_count?: number;
        avatar_url?: string;  // 新增字段
    };
    tag_list: string[];  // 修改为字符串数组
    tags: string;        // 保留此字段
    category: string;    // 新增字段
    cover_image_url: string;  // 新增字段
    is_published: boolean;     // 修改字段名以匹配后端
    views?: number;           // 可选字段
    isFeatured?: boolean;     // 可选字段
}