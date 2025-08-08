// 个人用户
export interface User {
    id: number;
    username: string;
    email: string;
    nickname?: string;
    avatar_file?: string;
    avatar_url?: string;
    avatar?: string;
    bio?: string;
    is_station_master: boolean;
    date_joined: string;
    // 添加字段定义
    post_count?: number;
    tag_count?: number;
}