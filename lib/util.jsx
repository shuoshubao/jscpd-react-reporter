import React from 'react'
import { Typography } from 'antd'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import less from 'highlight.js/lib/languages/less'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import plaintext from 'highlight.js/lib/languages/plaintext'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('less', less)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('plaintext', plaintext)

export const getHighlightCode = (code, language) => {
  return hljs.highlight(code, { language: hljs.getLanguage(language) ? language : 'plaintext' }).value
}

export const isDark = () => {
  const { matchMedia } = window
  return matchMedia('(prefers-color-scheme: dark)').matches
}

export const addListenerPrefersColorScheme = callback => {
  const { matchMedia } = window
  matchMedia('(prefers-color-scheme: dark)').addListener(mediaQueryList => {
    callback(mediaQueryList.matches)
  })
  matchMedia('(prefers-color-scheme: light)').addListener(mediaQueryList => {
    callback(!mediaQueryList.matches)
  })
}

export const renderFileInfo = file => {
  const { sourceId, start, end } = file
  const text = [sourceId, '(', start.line, ':', start.column, '-', end.line, ':', end.column, ')'].join('')
  return (
    <div>
      <Typography.Text
        copyable={{
          text: [sourceId, start.line, start.column].join(':'),
          tooltips: ['复制文件路径及代码位置']
        }}
      >
        {text}
      </Typography.Text>
    </div>
  )
}
