export interface Guess {
   id: number;
  guess: {
    id: number;
    name: string;
    imageUrl1: string;
  };
  isCorrect: boolean;
  guessedImageUrl1: string; // se for duplicado do guess.imageUrl1, pode tirar
  comparison: {
    [key: string]: {
      guessed: string | string[];
      target: string | string[];
    };
  };
  createdAt: string;
}

export interface Character {
  id: number;
  name: string;
  description?: string;
  emojis: string[];
  gender: 'MALE' | 'FEMALE';
  race: string[];
  ethnicity: string[];
  hair: string;
  aliveStatus: 'ALIVE' | 'DEAD';
  paper: string[];
  imageUrl1?: string;
  imageUrl2?: string;
}
