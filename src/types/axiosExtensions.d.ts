import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

declare module 'axios' {
    interface AxiosInstance {
        // 重新定义get方法，使其直接返回数据而不是响应对象
        get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        // 同样为其他HTTP方法添加类似定义
        post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    }
}