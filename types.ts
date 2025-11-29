export type Gender = 'Male' | 'Female' | 'Non-binary';

export interface HeroData {
  image: string | null; // Base64 string
  gender: Gender;
  heroName: string;
  theme: string;
}

export enum AppStep {
  UPLOAD = 'UPLOAD',
  DETAILS = 'DETAILS',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}

export interface GenerationResult {
  imageUrl: string;
  description: string;
}