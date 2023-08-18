### 聊天室部署说明
#### 部署前端服务
1. 打包前端文件生成 dist 文件夹
```js
  // chat-client
  npm i
  npm run build 
```
1. 将 dist 下所有文件放到 nginx 下的 html 文件夹中
2. 配置 nginx 的 gzip
```js
// nginx.conf
http {
  include mime.types; 
  #nginx开启gzip
  gzip on; 
  gzip_static on;
  gzip_buffers 4 16k;
  gzip_comp_level 5;
  gzip_types text/plain application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg 
              image/gif image/png;
  
  #nginx请求级别配置
  server {
    listen       80;
    server_name  www.domain.com;
    location / {
      root   html;
      index  index.html index.htm;
      add_header Cache-Control public;
    }

    location ^~/api/ {
      rewrite ^/api/(.*) /$1 break;
      proxy_pass http://localhost:3000;
    }

    location ^~/socket.io/ {
      proxy_pass http://localhost:3000;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
  }  
}
```

#### 数据库配置
1. 安装 mysql
2. 设置 mysql 账号密码
3. 创建名为 `chat` 的数据库
4. 配置后端 `app.module.ts` 中的 mysql 账号密码
```js
// chat-server/src/app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      username: 'root',
      password: '',
      database: 'chat',
      charset: "utf8mb4",
      autoLoadEntities: true,
      synchronize: true
    }),
  ],
})
```

#### 部署后端服务
1. 安装 pm2
```js
// chat-server
npm i pm2 -g
```
2. 生成 dist 文件
```js
// chat-server
npm i
npm run build
```
3. 使用 pm2 运行
```js
// chat-server
npm run pm2

