'use client'

import { useEffect, useState } from 'react'
import type {
  GuessResult,
  StartPlayResponse,
  DailyProgressResponse,
} from '@/services/plays'
import { getDailyProgress, startPlay, makeGuess } from '@/services/plays'
import { ProgressCharacter } from '@/interfaces/Play'

export function useDescriptionMode() {
  const MODE_ID = 2

  const [playId, setPlayId] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasWon, setHasWon] = useState(false)
  const [targetCharacter, setTargetCharacter] = useState<ProgressCharacter | null>(null)
  const [showVictoryModal, setShowVictoryModal] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        // 1) Verifica progresso diário
        const progress: DailyProgressResponse = await getDailyProgress(MODE_ID)

        if (progress.alreadyPlayed) {
          setPlayId(progress.playId)
          setGuesses(progress.attempts)
          setTargetCharacter(progress.character)
          setHasWon(progress.completed)
          if (progress.completed) {
            setShowVictoryModal(true)
          }
          return
        }

        // 2) Se não jogou hoje, inicia nova partida
        const startRes: StartPlayResponse = await startPlay({ modeConfigId: MODE_ID })
        setPlayId(startRes.playId)
        setTargetCharacter(startRes.character)
      } catch (e: any) {
        console.error('[useDescriptionMode] init error:', e)
        setError('Erro ao iniciar o modo Descrição.')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const submitGuess = async (guess: string) => {
    if (!playId || hasWon) return

    try {
      const result: GuessResult = await makeGuess(playId, guess)
      setGuesses((prev) => [...prev, result])

      if (result.isCorrect) {
        setHasWon(true)
        setShowVictoryModal(true)
      }
    } catch (e: any) {
      console.error('[useDescriptionMode] submitGuess error:', e.response?.data || e.message)
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
