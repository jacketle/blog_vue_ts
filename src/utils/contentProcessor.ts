//const neteaseRegex = /\[\[netease-cloud:(\d+)\]\]/g
//渲染 Markdown + B站+网易云音乐


// src/utils/contentProcessor.ts
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { pinyin } from 'pinyin-pro'

// 初始化 markdown-it
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
})

// 存储解析过程中的标题信息
let toc: { id: string; text: string; depth: number }[] = []

// 自定义标题渲染器（添加 id）
md.renderer.rules.heading_open = (tokens: any[], idx: number, options: any, env: any, self: any) => {
    const token = tokens[idx]
    const level = token.tag.replace('h', '')
    const depth = parseInt(level)

    const textToken = tokens[idx + 1]
    let rawText = ''

    if (textToken && textToken.content) {
        rawText = textToken.content
    } else if (textToken && textToken.children) {
        for (const child of textToken.children) {
            rawText += child.content
        }
    }

    // 清理不可见字符
    rawText = rawText.replace(/[\s\n\r]/g, '')

    // 使用拼音转换生成 ID
    const pinyinText = pinyin(rawText, {
        pattern: 'pinyin',
        toneType: 'none' // 去除声调
    })

    // 将拼音转换为小写并移除非字母数字字符
    const id = pinyinText
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // 只保留字母和数字

    console.log('Raw Text:', rawText)
    console.log('Generated ID:', id)

    toc.push({ id, text: rawText, depth })

    return `<${token.tag} id="${id}">`
}

// 处理 Markdown + 嵌入语法 + 目录生成
export function processContent(content: string) {
    toc = []
    const htmlContent = md.render(content)

    // 处理 B 站视频嵌入
    const bilibiliRegex = /<iframe[^>]*src="([^"]*player\.bilibili\.com[^"]*)"[^>]*>/gi
    let updatedHTML = htmlContent.replace(bilibiliRegex, (match: string, src: string) => {
        // 修复：确保 data-src 是解码后的 URL
        const url = new URL(decodeURIComponent(src), window.location.href)
        return `
<div class="bilibili-embed">
  <div class="bilibili-container">
    <iframe
      class="lazy-load"
      width="100%"
      height="500"
      src="${url.toString()}"
      scrolling="no"
      border="0"
      autoplay="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
      allow="fullscreen"
    ></iframe>
  </div>
</div>
`
    })

    // 处理网易云音乐嵌入
    const neteaseRegex = /\[\[netease-cloud:(\d+)\]\]/g
    updatedHTML = updatedHTML.replace(neteaseRegex, (match: string, musicId: string) => {
        return `
<div class="netease-embed">
  <div class="netease-placeholder">
    <span class="loading loading-spinner loading-sm"></span>
    加载网易云音乐...
  </div>
  <meting-js
    server="netease"
    type="song"
    id="${musicId}"
  ></meting-js>
</div>
`
    })

    // 使用 DOMPurify 清理 HTML
    const sanitizedHTML = DOMPurify.sanitize(updatedHTML, {
        ADD_TAGS: ['iframe', 'meting-js'],
        ADD_ATTR: [
            'allowfullscreen',
            'frameborder',
            'framespacing',
            'scrolling',
            'border',
            'server',
            'type',
            'id'
        ]
    })

    return { html: sanitizedHTML, toc }
}