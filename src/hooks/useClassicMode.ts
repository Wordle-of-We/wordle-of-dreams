'use client'

import { useEffect, useState } from 'react'
import {
  getDailyProgress,
  startPlay,
  makeGuess,
} from '@/services/plays'
import { getAllCharacters } from '@/services/characters'
import type {
  GuessResult as ServiceGuessResult,
  DailyProgressResponse,
  StartPlayResponse,
} from '@/services/plays'
import type { Character as ServiceCharacter } from '@/interfaces/Character'
import { PlayCharacter, ProgressCharacter } from '@/interfaces/Play'

export function useClassicMode() {
  const MODE_ID = 1

  // estados de jogo
  const [playId, setPlayId] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<ServiceGuessResult[]>([])
  const [characters, setCharacters] = useState<ServiceCharacter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [hasWon, setHasWon] = useState(false)
  const [targetCharacter, setTargetCharacter] = useState<ProgressCharacter | null>(null)
  const [showVictoryModal, setShowVictoryModal] = useState(false)

  // Inicialização: busca personagens e progresso/jogo do dia
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        // 1) carrega lista completa (para autocomplete ou outras UIs)
        const chars = await getAllCharacters()
        setCharacters(chars)

        // 2) verifica se já jogou hoje
        const progress: DailyProgressResponse = await getDailyProgress(
          MODE_ID
        )
        if (progress.alreadyPlayed) {
          setPlayId(progress.playId)
          setGuesses(progress.attempts)
          setHasWon(progress.completed)
          setTargetCharacter(progress.character)
          if (progress.completed) setShowVictoryModal(true)
          return
        }

        // 3) inicia nova partida
        const startRes: StartPlayResponse = await startPlay({
          modeConfigId: MODE_ID,
        })
        setPlayId(startRes.playId)
        setTargetCharacter(startRes.character)
      } catch (err: any) {
        console.error(
          '[useClassicMode] Erro ao iniciar ou recuperar partida:',
          err.response?.data || err.message
        )
        setError('Erro ao iniciar partida.')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // Função para submeter palpite
  const submitGuess = async (name: string) => {
    if (!playId || hasWon) return

    try {
      const result: ServiceGuessResult = await makeGuess(playId, name)
      setGuesses((prev) => [...prev, result])

      if (result.isCorrect) {
        setHasWon(true)
        setShowVictoryModal(true)
      }
    } catch (err: any) {
      console.error(
        '[useClassicMode] Erro ao enviar palpite:',
        err.response?.data || err.message
      )
    }
  }

  return {
    // estados de controle
    playId,
    guesses,
    characters,
    loading,
    error,

    // vitória e target
    hasWon,
    targetCharacter,
    showVictoryModal,
    setShowVictoryModal,

    // ações
    submitGuess,
  }
}
