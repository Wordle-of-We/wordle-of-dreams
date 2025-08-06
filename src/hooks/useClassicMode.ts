'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getDailyProgress } from '@/services/playService'

type Character = {
  id: number
  name: string
  imageUrl1?: string
}

interface Comparison<T> {
  guessed: T
  target: T
}

export interface GuessResult {
  character: any
  guess: string
  isCorrect: boolean
  guessedImageUrl1: string
  comparison: {
    [key: string]: Comparison<any>
  }
  triedAt: string
}

export function useClassicMode() {
  const MODE_ID = 1

  const [playId, setPlayId] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [hasWon, setHasWon] = useState<boolean>(false)
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null)
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false)

  useEffect(() => {
    const init = async () => {
      try {
        // Verifica se já jogou
        const progress = await getDailyProgress(MODE_ID)

        if (progress?.alreadyPlayed) {
          setPlayId(progress.playId)
          setGuesses(progress.attempts ?? [])
          setHasWon(progress.completed ?? false)
          setTargetCharacter(progress.character)
          if (progress.completed) {
            setShowVictoryModal(true)
          }
          return
        }

        // Inicia nova partida
        const startRes = await api.post('/plays/start', { modeConfigId: MODE_ID })
        const data = startRes.data
        setPlayId(data.playId)
        setTargetCharacter(data.character)
      } catch (err: any) {
        console.error('[useClassicMode] Erro ao iniciar partida:', err.response?.data || err.message)
        setError('Erro ao iniciar partida.')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const submitGuess = async (name: string) => {
    if (!playId || hasWon) {
      console.warn('[useClassicMode] Partida encerrada ou não iniciada.')
      return
    }

    try {
      const res = await api.post(`/plays/${playId}/guess`, { guess: name })
      const result: GuessResult = res.data

      setGuesses(prev => [...prev, result])

      if (result.isCorrect) {
        setHasWon(true)
        setShowVictoryModal(true)
      }
    } catch (err: any) {
      console.error('[useClassicMode] Erro ao enviar palpite:', err.response?.data || err.message)
    }
  }

  return {
    playId,
    guesses,
    characters,
    loading,
    error,
    hasWon,
    targetCharacter,
    showVictoryModal,
    setShowVictoryModal,
    submitGuess,
  }
}
