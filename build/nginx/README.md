# nginx配置文件备份

##### 1. 文件用途
此文件是测试环境nginx的配置文件,存放项目中以防止测试服务器的文件丢失
##### 2. 使用方式
* nginx.conf文件放置于/usr/software/nginx/conf/ 目录下
```sh
cd /usr/software/nginx/conf/
rz
# 选择本地的 nginx.conf 文件并上传
```
> 说明：替换前请保证nginx不被其他项目使用

* 启动nginx
```sh
/usr/software/nginx/sbin/nginx
```
> 说明：启动前需保证前端项目已经发布到 /app/ns4-node/vue-demo 目录下

* 停止nginx
```sh
/usr/software/nginx/sbin/nginx -s stop
```
