# 商图工坊 / Commerce Image Studio

基于 [Pic Smaller](https://github.com/joye61/pic-smaller) 的开源网页版制作的电商图片工具。首版面向通用电商卖家，提供三个一键方案：

- 白底主图：导出 1600 × 1600 JPG，商品居中并留白。
- 轻量主图：导出 1200 × 1200 JPG，商品居中并留白。
- 详情页图片：长边调整到 1600 像素，导出 WebP。

图片在浏览器本地处理，可批量加入、检查和下载。预设不是任何平台的官方规范；上传前仍需核对平台要求及结果画质。透明图应用白底主图方案后会变成白底 JPG。小图可能被放大，放大不会增加原有细节。

## 本地运行

需要 Node.js 22 和 npm 10。

```bash
npm ci
npm run dev
```

打开 `http://localhost:3000`。运行 `npm test`、`npm run lint` 和 `npm run build` 可检查代码。项目也支持 `npm run build:pages` 静态导出。

## VPS 部署

建议用 HTTPS 对外提供服务。`compose.yaml` 给运行中的容器设了上限：最多使用半个 CPU 核心、384 MB 内存、64 个进程；不使用额外交换空间，临时目录最多 32 MB，容器日志最多保留约 10 MB。超出内存上限时本站可能重启，但不会继续占用其他业务的内存。带宽和反向代理日志不受这些上限控制，需要在反向代理或 CDN 另行限制。

**不要在承载其他业务的 VPS 上构建镜像。**构建过程不受运行容器的资源上限保护。请在与 VPS CPU 架构一致的其他机器上构建，填入实际站点网址，并把构建好的镜像传到 VPS：

```bash
docker build --build-arg SITE_URL=https://images.example.com -t commerce-image-studio .
docker save commerce-image-studio:latest | gzip > commerce-image-studio.tar.gz
```

把 `commerce-image-studio.tar.gz` 和 `compose.yaml` 传到 VPS 的同一目录后，在 VPS 上运行：

```bash
gzip -dc commerce-image-studio.tar.gz | docker load
docker compose up -d --no-build --pull never
docker inspect commerce-image-studio --format 'CPU={{.HostConfig.NanoCpus}} Memory={{.HostConfig.Memory}} Swap={{.HostConfig.MemorySwap}} PIDs={{.HostConfig.PidsLimit}}'
docker stats --no-stream commerce-image-studio
```

现有反向代理把域名的 HTTPS 流量转发到 `127.0.0.1:3100`。如果该端口已被占用，可在运行 `docker compose` 时设置 `COMMERCE_PORT`。`SITE_URL` 未设置时，页面会明确禁止搜索引擎收录，避免把未配置域名的版本发布出去。静态导出同样在构建时设置 `SITE_URL`。

## 来源与许可

本项目以 Pic Smaller 的网页版为基础。原项目版权与 MIT 许可见 [LICENSE](LICENSE)。桌面版并不包含在本项目中。
