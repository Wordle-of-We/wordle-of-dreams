'use client'

import { useEffect, useState } from 'react'
import { getDailyProgress, startPlay, makeGuess, getPlayProgress } from '@/services/plays'
import type { GuessResult } from '@/services/plays'
import type { PlayCharacter, DailyProgressResponse } from '@/interfaces/Play'

export function useEmojiMode() {
  const MODE_ID = 2

  const [playId, setPlayId] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasWon, setHasWon] = useState(false)
  const [targetCharacter, setTargetCharacter] = useState<PlayCharacter | null>(null)
  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [revealedEmojis, setRevealedEmojis] = useState<string[]>([])

  useEffect(() => {
    async function init() {
      setLoading(true)
      try {
        const progress: DailyProgressResponse = await getDailyProgress(MODE_ID)

        if (progress.alreadyPlayed) {
          setPlayId(progress.playId)
          setHasWon(progress.completed)

          const detail = await getPlayProgress(progress.playId)
          setGuesses(detail.attempts)
          setTargetCharacter(detail.character)

          const emojis = detail.character.emojis ?? []
          if (progress.completed) {
            setRevealedEmojis(emojis)
            setShowVictoryModal(true)
          } else {
            const count = Math.min(detail.attempts.length + 1, emojis.length)
            setRevealedEmojis(emojis.slice(0, count))
          }
          return
        }

        const started = await startPlay({ modeConfigId: MODE_ID })
        setPlayId(started.playId)
        setTargetCharacter(started.character)
        const emojis = started.character.emojis ?? []
        setRevealedEmojis(emojis.slice(0, 1))
      } catch (err: any) {
        console.error('[useEmojiMode] init error', err)
        setError(err?.message ?? 'Erro ao carregar modo Emoji.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const submitGuess = async (guess: string) => {
    if (!playId || hasWon || !targetCharacter) return
    try {
      const attempt = await makeGuess(playId, guess)
      setGuesses(prev => [...prev, attempt])

      const emojis = targetCharacter.emojis ?? []
      if (attempt.isCorrect) {
        setHasWon(true)
        setRevealedEmojis(emojis)
        setShowVictoryModal(true)
      } else {
        const nextCount = Math.min(revealedEmojis.length + 1, emojis.length)
        setRevealedEmojis(emojis.slice(0, nextCount))
      }
    } catch (err: any) {
      console.error('[useEmojiMode] submitGuess error', err)
    }
  }

  return {
    guesses,
    loading,
    error,
    hasWon,
    targetCharacter,
    revealedEmojis,
    showVictoryModal,
    setShowVictoryModal,
    submitGuess,
  }
}
