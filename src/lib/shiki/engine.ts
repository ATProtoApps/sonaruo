import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'
import type { BundledLanguage, BundledTheme, ThemedToken } from 'shiki'
import { languages } from './langs'

import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'

const getHighlighter = (() => {
  let highlighter: ReturnType<typeof createHighlighterCore> | null = null

  return async () => {
    if (!highlighter) {
      highlighter = createHighlighterCore({
        themes: [githubDark, githubLight],
        langs: languages,
        engine: createOnigurumaEngine(import('shiki/wasm')),
      })
    }
    return highlighter
  }
})()

export interface HighlightOptions {
  code: string
  lang?: BundledLanguage
  theme?: BundledTheme | 'system'
  lineNumbers?: boolean
  lineNumberStart?: number
  inline?: boolean
  debug?: boolean
}

export interface TokenizedCode {
  tokens: ThemedToken[][]
  bg: string | undefined
  fg: string | undefined
}

export async function tokenize(options: HighlightOptions): Promise<TokenizedCode> {
  if (!options.code) {
    return {
      tokens: [],
      bg: undefined,
      fg: undefined,
    }
  }

  const shiki = await getHighlighter()
  const actualTheme = options.theme === 'system' ? 'github-light' : options.theme

  try {
    const result = shiki.codeToTokens(options.code, {
      lang: options.lang || 'typescript',
      theme: actualTheme as BundledTheme,
      ...options,
    })

    return {
      tokens: result.tokens,
      bg: result.bg,
      fg: result.fg,
    }
  } catch (error) {
    console.error('Failed to tokenize code:', error)
    return {
      tokens: [[{ content: options.code, color: undefined, offset: 0 }]],
      bg: undefined,
      fg: undefined,
    }
  }
}
