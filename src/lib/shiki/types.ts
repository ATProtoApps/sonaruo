import type { BundledLanguage } from 'shiki'

export interface ParsedFence {
  code: string
  language?: BundledLanguage
  meta?: string
  raw?: string
}
