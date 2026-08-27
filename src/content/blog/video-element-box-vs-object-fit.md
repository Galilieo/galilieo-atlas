---
title: '为什么 object-fit: contain 仍然会让视频控制条被裁切'
description: '从父级媒体舞台、video 元素盒子、固有尺寸（intrinsic size）与 overflow 出发，复盘一次低高度窗口中的原生控制条裁切问题。'
publishedAt: 2026-08-27
category: 前端与移动端
tags:
  - CSS
  - 问题排查
draft: false
featured: false
readingTime: 7
order: 18
homepageState: 已发布
---

## 看起来已经 `contain`，视频为什么还会溢出

在一个带 Header、媒体舞台和底部操作区的全屏预览里，普通窗口下视频显示正常；窗口高度降低、横屏使用，或者底部提示词变长后，视频底部的原生控制条会被裁掉。

页面已经设置了：

```css
video {
  object-fit: contain;
}
```

因此我最初会自然地怀疑：是不是 Footer 太高、Padding 太大，或者视频比例计算不对。

继续测量 DOM 后，问题才变得明确。父级媒体舞台已经获得了正确的 Grid 高度，但 `<video>` 元素自己的盒子比舞台更高，底部大约超出 36px。舞台又设置了 `overflow: hidden`，原生控制条刚好落在被裁切的区域。

`object-fit` 并没有失效。它只是解决了另一个问题。

## `object-fit` 控制的是内容，不是元素盒子

调试图片和视频时，很容易把“媒体内容”和“媒体元素”当成同一层。

实际上需要分开看：

- Grid 或 Flex 决定父级可以分配多少空间；
- `width`、`height`、`max-width` 和 `max-height` 决定媒体元素盒子的大小；
- `object-fit` 决定图片或视频内容怎样放进这个盒子；
- `overflow` 决定盒子超出父级后是否还能看见。

`object-fit: contain` 能保证视频画面在 `<video>` 盒子里保持比例，却不会主动把这个盒子缩到父容器以内。

如果元素仍然受到视频固有尺寸或旧高度规则影响，它完全可能先长得比父级更高，再在自己的盒子里正确地 `contain`。此时画面比例没问题，控制条仍然在父级外面。

## 截图只能说明结果，尺寸链才能说明根因

这次我没有继续凭截图微调间距，而是同时记录了几个值：

```text
媒体舞台：top / bottom / height
video 元素：top / bottom / height
Footer：top
父级 overflow
```

修复前可以得到一条很清楚的关系：

```text
video bottom > stage bottom
stage bottom = footer top
overflow = hidden
```

因此控制条裁切不是“看起来像溢出”，而是视频元素盒子真实越过了媒体舞台边界。

这类数值还有一个好处：修改后可以用同一组指标验证，而不只是比较两张截图是否更顺眼。

## 让视频元素真正受媒体舞台约束

最终处理方式是把视频定位在舞台内部，让四个方向都以父级边界为约束，再使用最大宽高保持比例：

```css
.media-stage video {
  position: absolute;
  inset: 0;
  margin: auto;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}
```

这里每个属性承担的职责不同：

- `position: absolute` 与 `inset: 0` 把可用边界交给媒体舞台；
- `margin: auto` 让不足一边尺寸的视频保持居中；
- `max-width` 和 `max-height` 限制元素盒子本身；
- `width: auto` 与 `height: auto` 保留原始比例；
- `object-fit: contain` 继续处理盒子内部的媒体内容。

修改后再次测量，视频底部与舞台底部对齐，溢出归零，原生控制条也完整进入可见区域。

## 只约束视频还不够，剩余空间也要稳定

低高度窗口里，媒体舞台并不是唯一会失控的区域。底部提示词如果无限增长，仍然会持续挤压视频；操作按钮如果跟着文本换行，也可能离开视口。

因此我同时补了几条响应式边界：

- 低高度窗口压缩 Header 与 Footer 的非必要留白；
- 长提示词设置最大高度，并在自己的区域内滚动；
- 窄屏竖向排列提示词与操作按钮；
- 宽度足够时保持并排，避免无意义地增加 Footer 高度；
- 图片 Lightbox 继续使用原有布局，不让视频修复扩散到另一种媒体模式。

这些调整不是为了把所有元素都缩小，而是让每一层都知道自己的最大范围。父级空间、媒体盒子和文本区域同时受约束后，布局才不会把压力集中到视频控制条上。

## 原生控制条还带来平台差异

浏览器原生视频控制条并不是一套完全统一的 UI。不同浏览器、移动端 WebView 和编码比例可能影响它的高度、首帧尺寸和显示方式。

这次浏览器验证能够证明：在当前测试窗口中，视频元素不再越过媒体舞台，控制条完整可见。但它不能自动证明 Safari、Android WebView 和所有远程视频比例都没有差异。

因此验证结果要拆开写：

- DOM 尺寸链已经证明元素盒子溢出归零；
- 目标浏览器中的低高度与横屏场景已经通过；
- 其他浏览器的原生控制条仍需要单独回归。

## 我现在怎样排查媒体裁切

以后再遇到图片或视频显示不完整，我会先按下面的顺序检查：

```text
父级分配空间
  -> 媒体元素真实盒子
    -> 固有尺寸（intrinsic size）
      -> width / height / max-* 约束
        -> object-fit
          -> overflow
            -> Footer 与相邻区域位置
```

如果只盯着 `object-fit`，很容易一直调整画面填充方式，却没有发现真正越界的是元素盒子本身。

这次问题留下的判断很简单：**媒体内容保持比例，不等于媒体元素已经服从容器尺寸。**