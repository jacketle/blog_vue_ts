# 使用官方Node.js运行时作为父镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package.json和锁文件
COPY package.json pnpm-lock.yaml* ./

# 设置pnpm镜像源为国内镜像（可选）
RUN pnpm config set registry https://registry.npmmirror.com

# 安装依赖（使用--no-frozen-lockfile避免锁文件过期问题）
RUN pnpm install --no-frozen-lockfile

# 复制其余源代码
COPY . .

# 增加内存限制以避免构建时内存不足
ENV NODE_OPTIONS=--max-old-space-size=4096

# 构建应用
RUN pnpm build

# 安装serve以提供静态文件服务
RUN npm install -g serve

# 暴露端口
EXPOSE 5173

# 启动应用
CMD ["serve", "-s", "dist", "-l", "5173"]