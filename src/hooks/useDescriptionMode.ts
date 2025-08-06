'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getDailyProgress } from '@/services/playService'

type Character = {
  id: number
  name: string
  description?: string
  imageUrl1?: string
}

interface Comparison<T> {
  guessed: T
  target: T
}

export interface GuessResult {
  attemptNumber: number
  guess: string
  isCorrect: boolean
  playCompleted: boolean
  guessedImageUrl1: string
  comparison: {
    [key: string]: Comparison<any>
  }
  triedAt: string
}

export function useDescriptionMode() {
  const MODE_ID = 2

  const [playId, setPlayId] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasWon, setHasWon] = useState(false)
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null)
  const [showVictoryModal, setShowVictoryModal] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Verifica progresso do dia (se já jogou)
        const progress = await getDailyProgress(MODE_ID)

        if (progress?.alreadyPlayed) {
          setPlayId(progress.playId)
          setGuesses(progress.attempts)
          setTargetCharacter(progress.character)
          setHasWon(progress.completed)
          if (progress.completed) setShowVictoryModal(true)
          return
        }

        // 2. Inicia uma nova partida
        const startRes = await api.post('/plays/start', { modeConfigId: MODE_ID })
        const data = startRes.data

        setPlayId(data.playId)
        setTargetCharacter(data.character)
      } catch (e: any) {
        console.error('useDescriptionMode error:', e)
        setError('Erro ao iniciar o modo descrição.')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const submitGuess = async (guess: string) => {
    if (!playId || hasWon) return
    try {
      const res = await api.post(`/plays/${playId}/guess`, { guess })
      const result: GuessResult = res.data
      setGuesses(prev => [...prev, result])
      if (result.isCorrect) {
        setHasWon(true)
        setShowVictoryModal(true)
      }
    } catch (e: any) {
      console.error('submitGuess error', e.response?.data || e.message)
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
