export interface PizzaIngredientInfo {
  name: string;
  count: number;
}

export interface Pizza {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  calories: number;
  imageUrl: string;
  bgSymbol: string; // The letters/words shown behind the pizza
  accentColor: string; // Tailored highlight colour for buttons/highlights
  mainColor: string; // Primary text/palette colour
  bgLightColor: string; // Specific soft tint for cards
  ingredients: string[]; // List of ingredient IDs present on this pizza
}

export interface FloatingIngredientInstance {
  id: string;
  type: 'basil' | 'tomato' | 'olive' | 'jalapeno' | 'mushroom' | 'onion';
  scale: number; // For depth simulation
  x: number; // Percentage offset on screen
  y: number; // Percentage offset on screen
  depth: number; // 1 (front) to 3 (very back) for parallax weighting
  rotation: number;
}
