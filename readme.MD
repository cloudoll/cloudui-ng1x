#  cloud-ui

cloud-ui


## 初始化


```
    npm install  
    npm install -g nodemon  
```


 预编译lib

 $ NODE_ENV=development webpack --config  webpack.dll.config.js --progress  
 $ NODE_ENV=production webpack --config  webpack.dll.config.js --progress  


## 启动

开发模式

```
    nodemon or npm run start
```

模拟正式环境

```
    npm run release
```

发布

```
    npm run build
```

