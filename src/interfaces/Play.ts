import { Character } from "./Character";
import { GameMode } from "./GameMode";
import { User } from "./User";

export interface Comparison<T> {
  guessed: T;
  target: T;
}

export type ComparisonRecord = Record<
  string,
  | Comparison<string>
  | Comparison<string[]>
>;

export interface GuessResult {
  attemptNumber: number;
  guess: string;
  isCorrect: boolean;
  playCompleted: boolean;
  guessedImageUrl1: string | null;
  comparison: ComparisonRecord;
  triedAt: string;
}

export interface StartPlayDto {
  modeConfigId: number;
}

export interface PlayCharacter {
  id: number;
  name: string;
  description: string | null;
  imageUrl1: string | null;
  emojis: string[];
}

export interface StartPlayResponse {
  playId: number;
  completed: boolean;
  attemptsCount: number;
  character: PlayCharacter;
  guestId?: string;
}

export interface DailyProgressResponseNoPlay {
  alreadyPlayed: false;
}

export interface DailyProgressResponseYesPlay {
  alreadyPlayed: true;
  playId: number;
  completed: boolean;
  character: {
    id: number;
    name: string;
    description: string | null;
    imageUrl1: string | null;
  };
  attempts: GuessResult[];
}

export interface ProgressCharacter {
  id: number;
  name: string;
  description: string | null;
  imageUrl1: string | null;
}

export interface DailyProgressResponseYesPlay {
  alreadyPlayed: true;
  playId: number;
  completed: boolean;
  character: ProgressCharacter;
  attempts: GuessResult[];
}

export type DailyProgressResponse =
  | DailyProgressResponseNoPlay
  | DailyProgressResponseYesPlay;

export interface PlayProgressResponse {
  playId: number;
  completed: boolean;
  character: PlayCharacter;
  attempts: GuessResult[];
}

export interface GamePlay {
  id: string;
  userId: string;
  user: User;
  gameModeId: string;
  gameMode: GameMode;
  characterId: string;
  character: Character;
  attempts: number;
  completed: boolean;
  createdAt: string;
}

export interface Attempt {
  id: string;
  gamePlayId: string;
  gamePlay: GamePlay;
  guess: string;
  isCorrect: boolean;
  timestamp: string;
}
