export interface PetNameSuggestion {
  name: string;
  reason: string;
}

export interface PetNamingResponse {
  names: PetNameSuggestion[];
}

export type PetType = 'dog' | 'cat' | 'bird' | 'reptile' | 'other';

export interface NamingRequest {
  petType: string;
  temperament: string;
  theme: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
