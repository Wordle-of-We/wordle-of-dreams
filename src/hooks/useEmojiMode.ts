'use client'

import { useEffect, useState } from 'react'
import {
  getDailyProgress,
  startPlay,
  makeGuess,
} from '@/services/plays'
import { getSelectionByMode } from '@/services/dailySelection'
import type { GuessResult } from '@/services/plays'
import type { Character } from '@/interfaces/Character'

export function useEmojiMode() {
  const MODE_ID = 3

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
        // 1) Seleção diária via service
        const selection = await getSelectionByMode(MODE_ID)
        const character = selection.character

        if (!character?.emojis?.length) {
          throw new Error(
            'O personagem do dia não foi encontrado ou não possui emojis.'
          )
        }
        setTargetCharacter(character)

        // 2) Inicia ou recupera a partida
        const { playId: startedId } = await startPlay({ modeConfigId: MODE_ID })
        setPlayId(startedId)

        // 3) Verifica progresso
        const progress = await getDailyProgress(MODE_ID)
        if (progress.alreadyPlayed) {
          setGuesses(progress.attempts)
          setHasWon(progress.completed)

          if (progress.completed) {
            setRevealedEmojis(character.emojis)
            setShowVictoryModal(true)
          } else {
            // exibe um emoji a mais que o número de tentativas já feitas
            const count = Math.min(
              progress.attempts.length + 1,
              character.emojis.length
            )
            setRevealedEmojis(character.emojis.slice(0, count))
          }
        } else {
          // primeira tentativa do dia: exibe só o primeiro emoji
          setRevealedEmojis(character.emojis.slice(0, 1))
        }
      } catch (err: any) {
        console.error('[useEmojiMode] init error', err)
        setError(err.message ?? 'Erro ao carregar modo Emoji.')
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
      setGuesses((prev) => [...prev, attempt])

      const emojis = targetCharacter.emojis
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
