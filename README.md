# 商图工坊 / Commerce Image Studio

基于 [Pic Smaller](https://github.com/joye61/pic-smaller) 的开源网页版制作的电商图片工具。首版面向通用电商卖家，提供三个一键方案：

- 白底主图：导出 1600 × 1600 JPG，商品居中并留白。
- 轻量主图：导出 1200 × 1200 JPG，商品居中并留白。
- 详情页图片：长边调整到 1600 像素，导出 WebP。

图片在浏览器本地处理，可批量加入、检查和下载。预设不是任何平台的官方规范；上传前仍需核对平台要求及结果画质。透明图应用白底主图方案后会变成白底 JPG。小图可能被放大，放大不会增加原有细节。

加入图片后可点每张图片旁的编辑按钮，旋转、拖选裁剪、调亮或去背景；保存后会按当前方案重新生成结果，也可撤销未保存的步骤或恢复最初上传的原图。去背景会自动收紧多余留白。去背景所需文件仅在使用该功能时由浏览器下载，首次约 55 MB；图片本身不会上传到服务器。复杂边缘和透明商品仍需人工检查。

## 本地运行

需要 Node.js 22 和 npm 10。

```bash
npm ci
npm run dev
```

打开 `http://localhost:3000`。运行 `npm test`、`npm run lint` 和 `npm run build` 可检查代码。项目也支持 `npm run build:pages` 静态导出。

## VPS 部署

建议用 HTTPS 对外提供服务。`compose.yaml` 给运行中的容器设了上限：最多使用半个 CPU 核心、384 MB 内存、64 个进程；不使用额外交换空间，临时目录最多 32 MB，容器日志最多保留约 10 MB。超出内存上限时本站可能重启，但不会继续占用其他业务的内存。带宽和反向代理日志不受这些上限控制，需要在反向代理或 CDN 另行限制。

### 用 Coolify 部署

仓库的 GitHub Actions 会先在 GitHub 上检查并构建镜像，推送到 `ghcr.io/qkjin/commerce-image-studio:latest`。请在 Coolify 中选 **Docker Image**，填入这个镜像地址，将 **Ports Exposes** 设为 `3000`，再设置域名。这样构建工作不会占用 VPS 的资源。GitHub 新建的镜像包默认是私有的；需要在 GitHub Packages 中将它设为公开，或者在 Coolify 配置拉取私有镜像的凭据。

在 Coolify 的 **Configuration → Resource Limits** 中把 **Number of CPUs** 设为 `0.5`，**Maximum Memory Limit** 和 **Maximum Swap Limit** 都设为 `384m`，保存后重新部署。Coolify 的 Docker Image 部署不会读取本仓库的 `compose.yaml`，因此这些限制需要在 Coolify 中单独填写。

正式对外开放前，在 GitHub 仓库 **Settings → Secrets and variables → Actions → Variables** 中创建 `SITE_URL`，值为完整站点网址（例如 `https://images.example.com`），然后在 Actions 中重新运行 **Check and publish image**，并在 Coolify 重新部署。未设置 `SITE_URL` 的构建会阻止搜索引擎收录。Coolify 的域名设置不会替代此构建参数。

镜像目前构建为 `linux/amd64`，适用于常见的 x86 VPS；ARM VPS 需改为对应架构后重新构建。部署后请实际打开域名，测试上传、编辑、去背景、下载，并检查容器资源占用。

### 不使用 Coolify

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

去背景模型与处理流程参考 [browser-remove-background](https://github.com/chenjindu/browser-remove-background)，其模型及代码采用 Apache 2.0 许可，许可文本见 [licenses/browser-remove-background.LICENSE](licenses/browser-remove-background.LICENSE)。模型在构建时从固定版本下载并验证内容；约 44 MB 的模型文件和约 11 MB 的运行文件会随站点静态资源提供，建议经 CDN 缓存，避免反复占用 VPS 带宽。浏览器运行库为 [ONNX Runtime Web](https://github.com/microsoft/onnxruntime)。
