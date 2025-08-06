'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getDailyProgress } from '@/services/playService'

export type Character = {
  id: number
  name: string
  emojis: string[]
  imageUrl1?: string
  description?: string
}

export interface GuessResult {
  attemptNumber: number
  guess: string
  isCorrect: boolean
  playCompleted: boolean
  guessedImageUrl1: string | null
  comparison: Record<string, any>
  triedAt: string
}

export function useEmojiMode() {
  const MODE_ID = 3 // ID correto do modo Emoji

  const [playId, setPlayId] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasWon, setHasWon] = useState(false)
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null)
  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [revealedEmojis, setRevealedEmojis] = useState<string[]>([])

  useEffect(() => {
    async function init() {
      try {
        const response = await api.get(`/daily-selection/${MODE_ID}`)
        const character: Character = response.data?.character

        if (!character || !character.emojis || character.emojis.length === 0) {
          throw new Error('O personagem do dia não foi encontrado ou não possui emojis.')
        }

        setTargetCharacter(character)

        const startRes = await api.post('/plays/start', { modeConfigId: MODE_ID })
        setPlayId(startRes.data.playId)

        const progress = await getDailyProgress(MODE_ID)

        if (progress?.alreadyPlayed) {
          setGuesses(progress.attempts || [])
          setHasWon(progress.completed)

          if (progress.completed) {
            setRevealedEmojis(character.emojis)
            setShowVictoryModal(true)
          } else {
            const count = Math.min((progress.attempts.length || 0) + 1, character.emojis.length)
            setRevealedEmojis(character.emojis.slice(0, count))
          }
        } else {
          // Primeira vez jogando hoje
          setRevealedEmojis(character.emojis.slice(0, 1))
        }
      } catch (err: any) {
        console.error('[useEmojiMode] Erro ao iniciar modo:', err)
        setError(err.message || 'Erro ao carregar modo Emoji.')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const submitGuess = async (guess: string) => {
    if (!playId || hasWon) return

    try {
      const res = await api.post<GuessResult>(`/plays/${playId}/guess`, { guess })
      const attempt = res.data
      setGuesses(prev => [...prev, attempt])

      const emojis = targetCharacter?.emojis ?? []

      if (attempt.isCorrect) {
        setHasWon(true)
        setRevealedEmojis(emojis)
        setShowVictoryModal(true)
      } else {
        const nextCount = Math.min(revealedEmojis.length + 1, emojis.length)
        setRevealedEmojis(emojis.slice(0, nextCount))
      }
    } catch (err: any) {
      console.error('[useEmojiMode] Erro ao enviar palpite:', err.response?.data || err.message)
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
