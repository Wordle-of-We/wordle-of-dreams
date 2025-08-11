'use client'

import { useEffect, useState } from 'react'
import { getDailyProgress, startPlay, makeGuess } from '@/services/plays'
import type { StartPlayResponse } from '@/services/plays'
import type {
  GuessResult,
  PlayCharacter,
  ProgressCharacter,
  DailyProgressResponse,
} from '@/interfaces/Play'

export function useDescriptionMode() {
  const MODE_ID = 3

  const [playId, setPlayId] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasWon, setHasWon] = useState(false)
  const [targetCharacter, setTargetCharacter] =
    useState<PlayCharacter | ProgressCharacter | null>(null)
  const [showVictoryModal, setShowVictoryModal] = useState(false)

  useEffect(() => {
    let mounted = true

    async function init() {
      setLoading(true)
      setError(null)

      try {
        // 1) Verifica progresso diário
        const progress: DailyProgressResponse = await getDailyProgress(MODE_ID)
        if (!mounted) return

        if (progress.alreadyPlayed) {
          setPlayId(progress.playId)
          setGuesses(progress.attempts || [])
          setTargetCharacter(progress.character || null)
          setHasWon(!!progress.completed)
          if (progress.completed) setShowVictoryModal(true)
          return
        }

        // 2) Se não jogou hoje, inicia nova partida
        const startRes: StartPlayResponse = await startPlay(MODE_ID)
        if (!mounted) return

        setPlayId(startRes.playId)
        setTargetCharacter(startRes.character as PlayCharacter)
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error('[useDescriptionMode] init error:', e)
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          'Erro ao iniciar o modo Descrição.'
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
    if (!playId || hasWon) return
    const trimmed = (guess || '').trim()
    if (!trimmed) return

    try {
      const result: GuessResult = await makeGuess(playId, trimmed)
      setGuesses((prev) => [...prev, result])

      if (result.isCorrect) {
        setHasWon(true)
        setShowVictoryModal(true)
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[useDescriptionMode] submitGuess error:', e?.response?.data || e?.message)
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Falha ao enviar palpite.'
      setError(msg)
    }
  }

  return {
    playId,
    guesses,
    loading,
    error,
    hasWon,
    targetCharacter,
    showVictoryModal,
    setShowVictoryModal,
    submitGuess,
  }
}
