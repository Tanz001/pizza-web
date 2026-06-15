import { Pizza } from './types';

export const PIZZAS: Pizza[] = [
  {
    id: 'diavola',
    name: 'LA DIAVOLA',
    displayName: 'Pepperoni Supreme',
    tagline: 'WOOD-FIRED SPICED CHARCUTERIE',
    description: 'Double-cured Calabrian salami, artisanal black truffle olives, hand-torn whole-milk mozzarella, and charred red chilis over our signature 48-hour slow-fermented Neapolitan sourdough base.',
    price: 24.50,
    rating: 4.9,
    reviewsCount: 382,
    prepTime: '12 min',
    calories: 840,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=1000&auto=format&fit=crop&q=90',
    bgSymbol: 'DIAVOLA',
    accentColor: '#8E1F0D',
    mainColor: '#C64A19',
    bgLightColor: '#FFECDA',
    ingredients: ['onion', 'olive', 'tomato', 'basil']
  },
  {
    id: 'margherita',
    name: 'PRIMAVERA',
    displayName: 'Margherita Delight',
    tagline: 'CONCENTRATION OF ITALIAN SUNSHINE',
    description: 'Sweet San Marzano gold tomatoes, premium buffalo mozzarella, aromatic pressed olive oil, and freshly picked organic Genovese basil leaves baked until blistering.',
    price: 19.50,
    rating: 4.8,
    reviewsCount: 512,
    prepTime: '10 min',
    calories: 720,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1000&auto=format&fit=crop&q=90',
    bgSymbol: 'PRIMAVERA',
    accentColor: '#C64A19',
    mainColor: '#8E1F0D',
    bgLightColor: '#FFF2E5',
    ingredients: ['basil', 'tomato', 'onion']
  },
  {
    id: 'ortolana',
    name: 'L\'ORTOLANA',
    displayName: 'Farmhouse Garden',
    tagline: 'PREMIUM FLOURISHING HARVEST',
    description: 'Wood-roasted cremini mushrooms, crisp organic jalapeños, sweet gold cherry tomatoes, red onion strings, and fresh mountain oregano, paired with an herb-infused extra virgin olive oil crust drizzle.',
    price: 22.00,
    rating: 4.9,
    reviewsCount: 224,
    prepTime: '11 min',
    calories: 780,
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=1000&auto=format&fit=crop&q=90',
    bgSymbol: 'ORTOLANA',
    accentColor: '#4A5D4E',
    mainColor: '#8E1F0D',
    bgLightColor: '#F0EAD6',
    ingredients: ['mushroom', 'jalapeno', 'onion', 'tomato', 'basil']
  }
];
