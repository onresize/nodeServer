# 使用官方的 Node.js 镜像作为基础镜像
FROM node:18.18.0

# 设置工作目录
WORKDIR /app

COPY package.json yarn.lock ./

# 安装 Node.js 依赖
RUN yarn

# 复制应用程序代码到工作目录
COPY . .

# 暴露应用程序运行的端口
EXPOSE 3000

# 运行应用程序的命令
CMD ["yarn", "koa"]
