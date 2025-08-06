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
  const MODE_ID = 2 // ou 3, conforme seu ambiente

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
        // 1) Buscar seleção do dia
        const selRes = await api.get('/daily-selection/latest')
        const sel = selRes.data.find((s: any) => s.modeConfigId === MODE_ID)

        if (!sel || !sel.character) {
          throw new Error('Nenhuma seleção encontrada para este modo hoje')
        }

        const char = sel.character as Character

        // Verifica se o personagem tem emojis
        if (!Array.isArray(char.emojis) || char.emojis.length === 0) {
          throw new Error('Personagem não possui emojis válidos')
        }

        setTargetCharacter(char)

        // 2) Inicia (ou retoma) a partida
        const startRes = await api.post('/plays/start', { modeConfigId: MODE_ID })
        setPlayId(startRes.data.playId)

        // 3) Revela o primeiro emoji
        setRevealedEmojis(char.emojis.slice(0, 1))

        // 4) Verifica progresso
        const prog = await getDailyProgress(MODE_ID)
        if (prog?.alreadyPlayed) {
          setGuesses(prog.attempts)
          setHasWon(prog.completed)

          if (prog.completed) {
            setRevealedEmojis(char.emojis)
            setShowVictoryModal(true)
          } else {
            const n = Math.min(prog.attempts.length + 1, char.emojis.length)
            setRevealedEmojis(char.emojis.slice(0, n))
          }
        }
      } catch (e: any) {
        console.error('useEmojiMode init error', e)
        setError('Erro ao iniciar modo Emoji')
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

      const ems = targetCharacter?.emojis ?? []
      if (attempt.isCorrect) {
        setHasWon(true)
        setRevealedEmojis(ems)
        setShowVictoryModal(true)
      } else {
        const nextCount = Math.min(attempt.attemptNumber + 1, ems.length)
        setRevealedEmojis(ems.slice(0, nextCount))
      }
    } catch (e: any) {
      console.error('useEmojiMode submitGuess error', e.response?.data || e.message)
      // Pode adicionar feedback visual aqui, se desejar
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
