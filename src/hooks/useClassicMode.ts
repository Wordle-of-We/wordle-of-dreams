import { useEffect, useState } from 'react'
import { getDailyProgress, startPlay, makeGuess } from '@/services/plays'
import { getAllCharacters } from '@/services/characters'
import type { StartPlayResponse } from '@/services/plays'
import type {
  GuessResult as PlayGuessResult,
  PlayCharacter,
  ProgressCharacter,
  DailyProgressResponse,
} from '@/interfaces/Play'
import type { Character as ServiceCharacter } from '@/interfaces/Character'

export function useClassicMode() {
  const MODE_ID = 1

  const [playId, setPlayId] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<PlayGuessResult[]>([])
  const [characters, setCharacters] = useState<ServiceCharacter[]>([])
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
        // tenta recuperar progresso do dia
        const progress: DailyProgressResponse = await getDailyProgress(MODE_ID)
        if (!mounted) return

        if (progress?.alreadyPlayed) {
          setPlayId(progress.playId)
          setGuesses(progress.attempts || [])
          setHasWon(!!progress.completed)
          setTargetCharacter(progress.character || null)
          if (progress.completed) setShowVictoryModal(true)
        } else {
          // inicia (ou reutiliza) a partida do dia
          const started: StartPlayResponse = await startPlay(MODE_ID)
          if (!mounted) return

          setPlayId(started.playId)
          setHasWon(!!started.completed)
          setTargetCharacter(started.character as PlayCharacter)
          if (started.completed) setShowVictoryModal(true)
        }
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Falha ao iniciar ou recuperar a partida.'
        setError(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    // sugestões de personagens (não bloqueante)
    getAllCharacters()
      .then((list) => {
        if (mounted) setCharacters(list || [])
      })
      .catch(() => {
        /* ignorar erro de sugestões */
      })

    return () => {
      mounted = false
    }
  }, [])

  const submitGuess = async (name: string) => {
    if (!playId || hasWon) return
    const guess = (name || '').trim()
    if (!guess) return

    try {
      const result: PlayGuessResult = await makeGuess(playId, guess)
      setGuesses((prev) => [...prev, result])

      if (result.isCorrect) {
        setHasWon(true)
        setShowVictoryModal(true)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Falha ao enviar palpite.'
      setError(msg)
      // opcional: log
      // eslint-disable-next-line no-console
      console.error('[useClassicMode] Erro ao enviar palpite:', err?.response?.data || err)
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
