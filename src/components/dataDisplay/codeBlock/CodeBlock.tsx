'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { tokenize, type TokenizedCode } from '@/lib/shiki/engine'
import type { BundledLanguage } from 'shiki'
import { CodeBlockSkeleton } from './CodeBlockSkeleton'
import { parseCode } from '@/lib/utils/text'

interface CodeBlockProps {
  content: string | undefined | null
  defaultLang?: BundledLanguage
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

export function CodeBlock({ content = '', defaultLang = 'typescript', theme = 'system', className }: CodeBlockProps) {
  const [result, setResult] = useState<TokenizedCode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!content) {
      setIsLoading(false)
      return
    }

    const parsed = parseCode(content)
    setIsLoading(true)

    tokenize({
      code: parsed.code,
      lang: parsed.language || defaultLang,
      theme: theme === 'system' ? (resolvedTheme === 'dark' ? 'github-dark' : 'github-light') : theme === 'dark' ? 'github-dark' : 'github-light',
    })
      .then(setResult)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [content, defaultLang, theme, resolvedTheme])

  if (!content) return null
  if (isLoading || !result) return <CodeBlockSkeleton />

  return (
    <div className="max-h-96 w-full">
      <pre
        className={`relative rounded-lg bg-skin-base border border-skin-base ${className ?? ''}`}
        style={{
          backgroundColor: result.bg || 'inherit',
          color: result.fg || 'inherit',
        }}
      >
        <code className="block p-4 text-sm overflow-x-auto">
          {result.tokens.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {line.map((token, j) => (
                <span
                  key={`${i}-${j}`}
                  style={{
                    color: token.color,
                    fontStyle: token.fontStyle ? 'italic' : undefined,
                    fontWeight: token.fontStyle === 2 ? 'bold' : undefined,
                  }}
                >
                  {token.content}
                </span>
              ))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
