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

建议用 HTTPS 对外提供服务。Docker 构建时填入实际站点网址，例如：

```bash
docker build --build-arg SITE_URL=https://images.example.com -t commerce-image-studio .
docker run -d --name commerce-image-studio --restart unless-stopped \
  --read-only --tmpfs /tmp:rw,noexec,nosuid,size=64m --cap-drop ALL \
  --security-opt no-new-privileges -p 127.0.0.1:3000:3000 commerce-image-studio
```

再用现有反向代理把域名的 HTTPS 流量转发到 `127.0.0.1:3000`。`SITE_URL` 未设置时，页面会明确禁止搜索引擎收录，避免把未配置域名的版本发布出去。静态导出同样在构建时设置 `SITE_URL`。

## 来源与许可

本项目以 Pic Smaller 的网页版为基础。原项目版权与 MIT 许可见 [LICENSE](LICENSE)。桌面版并不包含在本项目中。
