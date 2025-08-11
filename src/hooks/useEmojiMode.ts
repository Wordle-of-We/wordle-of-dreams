'use client'

import { useEffect, useState } from 'react'
import { getDailyProgress, startPlay, makeGuess } from '@/services/plays'
import type { StartPlayResponse } from '@/services/plays'
import type {
  GuessResult,
  PlayCharacter,
  DailyProgressResponse,
} from '@/interfaces/Play'

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
    let mounted = true

    async function init() {
      setLoading(true)
      setError(null)
      try {
        // 1) Garante a play do dia e pega o character COM emojis
        const startRes: StartPlayResponse = await startPlay(MODE_ID)
        if (!mounted) return
        setPlayId(startRes.playId)

        const playChar = startRes.character as PlayCharacter
        setTargetCharacter(playChar)

        // 2) Consulta progresso para saber tentativas/completo
        const progress: DailyProgressResponse = await getDailyProgress(MODE_ID)
        if (!mounted) return

        if (progress.alreadyPlayed) {
          // TS agora sabe que existem attempts/completed
          setGuesses(progress.attempts ?? [])
          setHasWon(!!progress.completed)

          const emojis = playChar.emojis ?? []
          if (progress.completed) {
            setRevealedEmojis(emojis)
            setShowVictoryModal(true)
          } else {
            const count = Math.min((progress.attempts?.length ?? 0) + 1, emojis.length)
            setRevealedEmojis(emojis.slice(0, count))
          }
        } else {
          // ainda não jogou hoje
          setGuesses([])
          setHasWon(false)
          const emojis = playChar.emojis ?? []
          setRevealedEmojis(emojis.slice(0, 1))
        }
      } catch (err: any) {
        console.error('[useEmojiMode] init error', err)
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Erro ao carregar modo Emoji.'
        setError(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()
    return () => {
      mounted = false
    }
  }, [])

  const submitGuess = async (guess: string) => {
    if (!playId || hasWon || !targetCharacter) return
    const trimmed = (guess || '').trim()
    if (!trimmed) return

    try {
      const attempt = await makeGuess(playId, trimmed)
      setGuesses((prev) => [...prev, attempt])

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
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Falha ao enviar palpite.'
      setError(msg)
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
