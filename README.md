<p align="center"><img src="public/icon.svg" width="96" height="96" alt=""></p>

# Commerce Image Studio / 商图工坊

English | [简体中文](README.zh-CN.md)

An ecommerce image tool built on the open-source web version of [Pic Smaller](https://github.com/joye61/pic-smaller). The first release targets general online sellers and offers three one-click presets:

- White main image: exports a 1600 × 1600 JPG with the product centered and padded.
- Light main image: exports a 1200 × 1200 JPG with the product centered and padded.
- Detail page image: resizes the long edge to 1600 pixels and exports WebP.

Images are processed locally in the browser and can be added, reviewed and downloaded in batches. The presets are not official specifications of any platform; check the platform's requirements and the output quality before uploading. Transparent images become white-background JPGs under the white main image preset. Small images may be upscaled, and upscaling does not add detail that was not there.

After adding images, click the edit button next to an image to rotate, drag-crop, brighten or remove the background. Saving regenerates the result with the current preset. You can undo unsaved steps or restore the originally uploaded image. Background removal automatically trims surplus margins. The files needed for background removal are downloaded by the browser only when the feature is used, about 55 MB the first time; images themselves are never uploaded to the server. Complex edges and transparent products still need a manual check.

## Run locally

Requires Node.js 22 and npm 10.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Run `npm test`, `npm run lint` and `npm run build` to check the code. The project also supports a static export with `npm run build:pages`.

## Deploy to a VPS

Serve the site over HTTPS. `compose.yaml` caps the running container at half a CPU core, 384 MB of memory and 64 processes, with no extra swap, at most 32 MB of temporary files and about 10 MB of container logs. If the memory cap is exceeded the site may restart, but it will not keep taking memory from other services. Bandwidth and reverse proxy logs are not covered by these caps; limit them separately in the reverse proxy or CDN.

### Deploy with Coolify

The repository's GitHub Actions workflow checks and builds the image on GitHub, then pushes it to `ghcr.io/qkjin/commerce-image-studio:latest`. In Coolify, choose **Docker Image**, enter this image address, set **Ports Exposes** to `3000`, and set the domain. The build therefore does not use VPS resources. The image package is public, so Coolify can pull it without registry credentials.

In Coolify, under **Configuration → Resource Limits**, set **Number of CPUs** to `0.5` and both **Maximum Memory Limit** and **Maximum Swap Limit** to `384m`, then save and redeploy. Coolify's Docker Image deployments do not read this repository's `compose.yaml`, so these limits must be entered in Coolify.

Before opening the site to the public, create a `SITE_URL` variable under the GitHub repository's **Settings → Secrets and variables → Actions → Variables**, with the full site URL as its value (for example `https://images.example.com`). Then re-run **Check and publish image** in Actions and redeploy in Coolify. Builds without `SITE_URL` block search engine indexing. Coolify's domain setting does not replace this build argument.

To count visits with a self-hosted [Umami](https://umami.is/), add two more Actions variables: `UMAMI_SCRIPT_URL` (for example `https://stats.example.com/script.js`) and `UMAMI_WEBSITE_ID`. The site then loads the cookie-free Umami script, records the events `images-added`, `preset-selected`, `download-single`, `download-zip`, `background-removed` and `background-failed` (counts and preset names only, never file names or image content), and mentions the statistics in its privacy section. Without these variables no analytics code is loaded.

The published image `ghcr.io/qkjin/commerce-image-studio` is the build for [slimtyx.com](https://slimtyx.com): it contains that site's `SITE_URL` and Umami settings. To run your own site, fork the repository and set your own variables, or build the image yourself.

The image is built for both `linux/amd64` and `linux/arm64`, so it runs on x86 and ARM VPS hosts; Docker pulls the matching one automatically. After deploying, open the domain and test uploading, editing, background removal and downloading, and check the container's resource usage.

### Without Coolify

**Do not build the image on a VPS that hosts other services.** The build is not protected by the running container's resource caps. Build on another machine with the same CPU architecture as the VPS, pass the real site URL, and transfer the built image to the VPS:

```bash
docker build --build-arg SITE_URL=https://images.example.com -t commerce-image-studio .
docker save commerce-image-studio:latest | gzip > commerce-image-studio.tar.gz
```

Copy `commerce-image-studio.tar.gz` and `compose.yaml` into the same directory on the VPS, then run on the VPS:

```bash
gzip -dc commerce-image-studio.tar.gz | docker load
docker compose up -d --no-build --pull never
docker inspect commerce-image-studio --format 'CPU={{.HostConfig.NanoCpus}} Memory={{.HostConfig.Memory}} Swap={{.HostConfig.MemorySwap}} PIDs={{.HostConfig.PidsLimit}}'
docker stats --no-stream commerce-image-studio
```

Forward the reverse proxy's HTTPS traffic to `127.0.0.1:3100`. If that port is taken, set `COMMERCE_PORT` when running `docker compose`. When `SITE_URL` is not set, pages explicitly forbid search engine indexing so that a version without a configured domain is not published. Static exports also take `SITE_URL` at build time.

## Origin and licenses

This project is based on the web version of Pic Smaller. The original project's copyright and MIT license are in [LICENSE](LICENSE); this project's own changes are also released under the MIT license. The Pic Smaller desktop edition is not part of this project. The project also includes third-party files under their own licenses; see the [third-party notices](THIRD_PARTY_NOTICES.md). In particular, the GIF processor cannot simply be used in closed-source projects under the MIT license.

The background-removal model and pipeline are adapted from [browser-remove-background](https://github.com/chenjindu/browser-remove-background), whose model and code are licensed under Apache 2.0; the license text is in [licenses/browser-remove-background.LICENSE](licenses/browser-remove-background.LICENSE). The model is downloaded from a pinned revision at build time and its content is verified. The model file of about 44 MB and runtime files of about 11 MB are served with the site's static assets; caching them through a CDN is recommended to avoid repeatedly using VPS bandwidth. The browser runtime is [ONNX Runtime Web](https://github.com/microsoft/onnxruntime).
