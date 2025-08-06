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
  const MODE_ID = 2;

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
        // Inicia partida
        const startRes = await api.post('/plays/start', { modeConfigId: MODE_ID })
        const { playId: id, character, completed } = startRes.data
        setPlayId(id)
        setTargetCharacter({
          id: character.id,
          name: character.name,
          description: character.description,
          imageUrl1: character.imageUrl1,
        })

        // Carrega progresso
        const prog = await getDailyProgress(MODE_ID)
        if (prog && prog.alreadyPlayed) {
          setGuesses(prog.attempts)
          setHasWon(prog.completed)
          if (prog.completed) setShowVictoryModal(true)
        }
      } catch (e) {
        console.error('useDescriptionMode error', e)
        setError('Não foi possível iniciar o jogo')
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
