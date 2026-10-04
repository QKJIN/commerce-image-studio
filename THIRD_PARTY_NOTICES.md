# Third-party notices / 第三方许可说明

The root [MIT license](LICENSE) covers the Pic Smaller-based application source. The following incorporated components retain their own licenses. This list also applies to the published container image and browser assets.

本仓库根目录的 MIT 许可适用于基于 Pic Smaller 的应用代码。下列引入的组件保留各自的许可；公开镜像和浏览器资源也包含这些组件。

| Component / 组件 | Distributed material / 分发内容 | License and attribution / 许可与署名 |
| --- | --- | --- |
| [Pic Smaller](https://github.com/joye61/pic-smaller) | Base web application / 网页应用基础 | MIT, Copyright (c) 2024 Joye; [LICENSE](LICENSE) |
| [browser-remove-background](https://github.com/chenjindu/browser-remove-background/tree/2d550542847cde6a8ba7c5128584de0fab32757b) | ISNet model and adapted background-removal pipeline / ISNet 模型和改写的处理流程 | Apache-2.0; [license](licenses/browser-remove-background.LICENSE). The adapted file is marked in its source header. |
| [ONNX Runtime Web 1.22.0](https://github.com/microsoft/onnxruntime/tree/v1.22.0/js/web) | Browser runtime and copied WASM assets / 浏览器运行库和复制的文件 | MIT, Copyright (c) Microsoft Corporation; [license](licenses/onnxruntime.LICENSE) |
| [squoosh-kit](https://github.com/bnowak008/squoosh-kit) | Imagequant, OxiPNG, AVIF and MozJPEG browser codecs / 四种浏览器图片编码器 | MIT for wrapper code, Copyright (c) Brent Nowak; Apache-2.0 for WebAssembly binaries derived from Squoosh, Copyright 2019 Google LLC; [MIT license](licenses/squoosh-kit.LICENSE) and [NOTICE including Apache-2.0](licenses/squoosh-kit.NOTICE) |
| [heic-to 1.5.2](https://github.com/hoppergee/heic-to/tree/v1.5.2) | HEIC/HEIF browser decoder, loaded only when needed / 按需加载的 HEIC/HEIF 浏览器解码器 | LGPL-3.0-or-later, Copyright Hopper Gee; [license](licenses/heic-to.LICENSE) and [source](https://github.com/hoppergee/heic-to/tree/v1.5.2). Its source documents included [libheif 1.22.2](https://github.com/strukturag/libheif/tree/v1.22.2) and [libde265 1.0.16](https://github.com/strukturag/libde265/tree/v1.0.16), also under LGPL terms. |
| [Sharp 0.35.3](https://github.com/lovell/sharp/tree/v0.35.3) and its prebuilt image libraries | Next.js server image processing, included in the container image / 容器内的图片处理库 | Sharp: Apache-2.0; [license](licenses/sharp.LICENSE). Its prebuilt libraries include libvips and other components under their own terms, including LGPL; see [third-party notices](licenses/sharp-libvips.THIRD-PARTY-NOTICES.md) and [source](https://github.com/lovell/sharp-libvips). |
| [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) | GIF browser wrapper / GIF 浏览器封装 | MIT; [license](licenses/gifsicle-wasm-browser.LICENSE) |
| [Gifsicle](https://github.com/kohler/gifsicle) | `public/wasm/gif.wasm`, distributed to browsers / 提供给浏览器的 GIF 程序 | Copyright (C) 1997-2019 Eddie Kohler. The browser wrapper identifies its bundled version as 1.92; the binary's exact source revision has not been independently established. Gifsicle offers GPL-2.0-only and an alternative permission for source-available products. See the original [copyright and alternative permission](licenses/gifsicle-v1.92.README) and [GPL-2.0 text](licenses/gifsicle-v1.92.COPYING). Reference source: [Gifsicle v1.92](https://github.com/kohler/gifsicle/tree/v1.92). |

Gifsicle's alternative permission requires the source code copyright notices to remain intact and requires the author's permission if the product source is not available to end users. This project's source is public. **Do not assume the GIF component can be reused in a closed-source derivative under the root MIT license.**

Gifsicle 的备选授权要求保留源码版权声明；如果将其用于不向最终用户提供源码的产品，需先获得作者许可。本项目源码公开。**不要将根目录的 MIT 许可理解为允许在闭源衍生产品中直接使用 GIF 组件。**

The HEIC decoder is a separate on-demand browser chunk. The application source and build instructions are public so that users can rebuild with a modified version of the LGPL library. The root MIT license does not replace heic-to's LGPL terms.

HEIC 解码器会作为独立的浏览器文件按需加载。应用源码和构建方法公开，用户可以换用修改后的 LGPL 版本自行构建。根目录的 MIT 许可不取代 heic-to 的 LGPL 条款。
