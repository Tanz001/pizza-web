import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Flame,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react';

import { PIZZAS } from './data';
import { FloatingIngredientInstance } from './types';
import { Navbar } from './components/Navbar';
import { IngredientSVG } from './components/IngredientSVG';
import { CustomCursor } from './components/CustomCursor';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Direct high-quality transparent PNG images of real ingredients (stored in public folder)
const REAL_INGREDIENT_IMAGES: Record<string, string> = {
  basil: '/ingredients/basil.png',
  tomato: '/ingredients/tomato.png',
  olive: '/ingredients/olive.png',
  jalapeno: '/ingredients/jalapeno.png',
  mushroom: '/ingredients/mushroom.png',
  onion: '/ingredients/onion.png',
};

const PARSLEY_SPRIG_IMAGE = '/ingredients/parsley-sprig.png';
const PARSLEY_LEAF_IMAGE = '/ingredients/parsley-leaf.png';
const CHILI_IMAGE = '/ingredients/chili.png';
const PEPPER_RED_IMAGE = '/ingredients/pepper-red.png';
const PARLOR_TOMATO_IMAGE = '/ingredients/tomato.png';

interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tagline: string;
}

const MENU_CATEGORIES_DATA: Record<string, MenuItemType[]> = {
  burgers: [
    {
      id: 'burg-1',
      name: 'La Caprese Gourmet Burger',
      description: 'Chianina prime beef, heirloom tomato, fresh burrata cream, cold-pressed basil pesto.',
      price: 15.50,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      tagline: 'PESTO BURRATA'
    },
    {
      id: 'burg-2',
      name: 'Tartufo Scamorza Burger',
      description: 'Dry-aged premium beef, aromatic black truffle glaze, melted Scamorza cheese, caramelized sweet onions.',
      price: 18.00,
      imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
      tagline: 'SCAMORZA TRUFFLE'
    }
  ],
  salad: [
    {
      id: 'salad-1',
      name: 'Burrata Campana Insalata',
      description: 'Fresh Bufala burrata heart on wild rocket, organic cherry tomatoes, glazed Modena balsamic reduction.',
      price: 14.50,
      imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2d87f0bc1?w=600&auto=format&fit=crop&q=80',
      tagline: 'VOLCANIC SWEETNESS'
    },
    {
      id: 'salad-2',
      name: 'Insalata Cesare Romana',
      description: 'Romaine cores, hand-shaved mature Pecorino Romano cheese, dynamic rosemary focaccia croutons.',
      price: 12.00,
      imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80',
      tagline: 'PECORINO ROMANO'
    }
  ],
  fries: [
    {
      id: 'fries-1',
      name: 'Patate Fritte al Tartufo',
      description: 'Crispy double-cooked skin-on Yukon fries dusted with finely grated Parmigiano-Reggiano and truffle nectar.',
      price: 8.50,
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
      tagline: 'AMALFI SEA SALT'
    },
    {
      id: 'fries-2',
      name: 'Focaccia Style Rosemary Fries',
      description: 'Hand-cut local potatoes fried with whole crushed garlic cloves and freshly plucked garden rosemary.',
      price: 7.00,
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80',
      tagline: 'ROSMARINO ORGANICO'
    }
  ],
  drinks: [
    {
      id: 'drink-1',
      name: 'San Pellegrino Aranciata',
      description: 'Sparkling mineral water blended with premium cold-pressed sun-ripened Sicilian blood orange juice.',
      price: 3.50,
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
      tagline: 'SICILIAN SUNLIGHT'
    },
    {
      id: 'drink-2',
      name: 'Birra Peroni Nastro Azzurro',
      description: 'Gourmet pale lager meticulously brewed with exclusive crisp Nostrano dell’Isola maize directly from Rome.',
      price: 6.50,
      imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=80',
      tagline: 'CRISP CLASSIC'
    }
  ],
  chicken: [
    {
      id: 'chk-1',
      name: 'Pollo Fritto al Rosmarino',
      description: 'Hand-battered organic chicken pieces seasoned with ground rosemary, garlic pollen, and dynamic hot oil splash.',
      price: 16.00,
      imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80',
      tagline: 'TUSCAN HERBS'
    },
    {
      id: 'chk-2',
      name: 'Diavola Hot Fire Tenderloin',
      description: 'Spicy pan-seared juicy chicken fillets glazed in Calabrian-pepper sauce and raw organic summer honey.',
      price: 11.50,
      imageUrl: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=600&auto=format&fit=crop&q=80',
      tagline: 'CALABRIAN DEVIL'
    }
  ]
};

// Coordinate list of floating ingredient points
// Scattered in polar coordinate layout to frame the central pizza beautifully
const INVENTURIED_INGREDIENTS: FloatingIngredientInstance[] = [
  { id: 'ing-1', type: 'basil', scale: 1.1, x: 18, y: 22, depth: 1, rotation: 35 },
  { id: 'ing-2', type: 'tomato', scale: 0.9, x: 74, y: 15, depth: 2, rotation: -20 },
  { id: 'ing-3', type: 'olive', scale: 1.2, x: 12, y: 55, depth: 1, rotation: 105 },
  { id: 'ing-4', type: 'jalapeno', scale: 1.0, x: 84, y: 58, depth: 3, rotation: -45 },
  { id: 'ing-5', type: 'mushroom', scale: 1.3, x: 26, y: 80, depth: 2, rotation: 12 },
  { id: 'ing-6', type: 'onion', scale: 1.1, x: 72, y: 78, depth: 1, rotation: 80 },
  { id: 'ing-7', type: 'basil', scale: 0.75, x: 85, y: 28, depth: 3, rotation: -75 },
  { id: 'ing-8', type: 'tomato', scale: 1.25, x: 28, y: 12, depth: 1, rotation: 40 },
  { id: 'ing-9', type: 'olive', scale: 0.8, x: 64, y: 24, depth: 2, rotation: -110 },
  { id: 'ing-10', type: 'jalapeno', scale: 1.15, x: 10, y: 35, depth: 2, rotation: 65 },
  { id: 'ing-11', type: 'mushroom', scale: 0.85, x: 78, y: 44, depth: 3, rotation: -12 },
  { id: 'ing-12', type: 'onion', scale: 1.35, x: 42, y: 88, depth: 1, rotation: 45 }
];

interface CraftCategoryStory {
  title: string;
  badge: string;
  story: string;
  details: string[];
  imageUrl: string;
}

const CATEGORIES_STORY_DATA: Record<string, CraftCategoryStory> = {
  pizza: {
    title: "THE CLASSIC NEAPOLITAN",
    badge: "THE PASSION FOR FLOUR",
    story: "Our legendary sourdough sits in temperature-controlled fermentation chambers for full 48 hours to activate native wild lactobacilli. Hand-stretched to retain perfect micro-bubbles, then baked in hand-built dome brick ovens. When the heat hits 485°C, moisture turns to steam instantaneously, puffing up the crust into a blistered 'cornicione' and cooking the sweet tomato toppings in under 90 seconds.",
    details: ["48-Hour Cold Sourdough Cure", "90-Second Extreme Thermal Bake", "100% Certified San Marzano Tomato"],
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
  },
  burgers: {
    title: "PRIME CHIANINA SELECTION",
    badge: "GOURMET BUTCHERY",
    story: "We grind absolute choice cuts of wet-aged Italian Chianina beef daily, seasoning merely with crushed Mediterranean rock salt and black peppercorn. Grilled over natural lump charcoal, layered under soft brioche bun halves, and glazed in thick organic truffle paste and melted vintage Scamorza cheese.",
    details: ["Premium Chianina Beef Choice", "Aged Smoked Scamorza Core", "Black Summer Truffle Glaze"],
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80"
  },
  salad: {
    title: "THE FRESH GARDEN",
    badge: "SEASONAL VEGETABLES",
    story: "Seasonal organic harvest celebrating volcanic-rich soils. We pluck young rocket crisp, tossing gently under aged Modena balsamic vinegar reduction and cold-pressed extra virgin culinary oils. Crowned proudly with a full creamy Burrata sphere displaying a sweet milk core.",
    details: ["Soil-certified Rocket Leaves", "Aged Modena Balsamic Dressing", "Whole Fresh Creamy Burrata"],
    imageUrl: "https://images.unsplash.com/photo-1623428187969-5da2d87f0bc1?w=800&auto=format&fit=crop&q=80"
  },
  fries: {
    title: "CRISPY TRUFFLE",
    badge: "GOLDEN POTATOES",
    story: "Finest local yellow-flesh Yukon potatoes are sliced thick, skin kept on, double-cooked for an incredibly crisp exterior and fluffy center. Dusted by fine garden rosemary leaves, whole garlic cloves, and heapings of shaved Parmigiano-Reggiano of raw-milk heritage.",
    details: ["Authentic Double-frying Method", "Mountain Rosemary-Infused Salt", "Parmigiano-Reggiano Cheese Dust"],
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80"
  },
  drinks: {
    title: "FINE DRINKS AND BEERS",
    badge: "LIQUID FRESHNESS",
    story: "Refreshing beverages to complement rich Italian cheese fats. Traditional sparkling mineral waters infused with true cold-pressed juices of Sicilian blood orange, or classic pale Roman lagers made from micro-harvested island maize for a clean finish.",
    details: ["Sicilian Blood Orange Juice", "Nastro Azzurro Pale Lager", "Zero Artificial Flavoring"],
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80"
  },
  chicken: {
    title: "TUSCAN CHICKEN",
    badge: "ARTISANAL POULTRY",
    story: "Organic breast and drum fillets bathed slow in fresh rosemary buttermilk, crusted inside double-sifted durum wheat semolina, fried crispy, and finished off with Calabrian spicy chili glaze and warm wild forest honey splashes.",
    details: ["Durum Wheat Semolina Crust", "Buttermilk Rosemary Marinade", "Calabrian Pepper & Wildflower Honey"],
    imageUrl: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&auto=format&fit=crop&q=80"
  }
};

const TESTIMONIALS = [
  {
    id: "test-1",
    name: "MATTHEW TAYLOR",
    quoteHtml: "Talking about this branch the staff, quality of food, <span class='underline decoration-[#FFBC00] decoration-2 underline-offset-4 font-semibold text-stone-200'>most importantly</span> the speed of service is just great! Highly recommended restaurant. <span class='underline decoration-[#FFBC00] decoration-2 underline-offset-4 font-semibold text-stone-100'>Must try take away services.</span>",
    rating: 5,
    tag: "FOOD LOVERS",
    badge: "Amazing",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=85&w=600&auto=format&fit=crop", // Straw hat woman
    skewFront: "rotate-[-4deg]",
    skewBack: "rotate-[6deg]",
  },
  {
    id: "test-2",
    name: "SARAH JENNINGS",
    quoteHtml: "This is hands-down the <span class='underline decoration-[#FFBC00] decoration-2 underline-offset-4 font-semibold text-stone-200'>finest wood-fired pizza</span> in town. The sourdough crust is thin, light, and perfectly blistered. A <span class='underline decoration-[#FFBC00] decoration-2 underline-offset-4 font-semibold text-stone-100'>true culinary masterpiece!</span>",
    rating: 5,
    tag: "PIZZA PURIST",
    badge: "Delicious",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=85&w=600&auto=format&fit=crop", // Smiling woman
    skewFront: "rotate-[5deg]",
    skewBack: "rotate-[-5deg]",
  },
  {
    id: "test-3",
    name: "OLIVER BENNETT",
    quoteHtml: "The service is outstandingly warm and professional. <span class='underline decoration-[#FFBC00] decoration-2 underline-offset-4 font-semibold text-stone-200'>Incredibly delicious food</span>, beautiful packaging and <span class='underline decoration-[#FFBC00] decoration-2 underline-offset-4 font-semibold text-stone-100'>flawless delivery speed.</span> Highly recommended!",
    rating: 5,
    tag: "CONNOISSEUR",
    badge: "Perfect",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=85&w=600&auto=format&fit=crop", // Smiling man
    skewFront: "rotate-[-3deg]",
    skewBack: "rotate-[4deg]",
  }
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // To throttle sliding animations
  const [selectedCategory, setSelectedCategory] = useState('pizza');
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const pizzaContainerRef = useRef<HTMLDivElement>(null);
  const pizzaInnerRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const ingredientsRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const currentPizza = PIZZAS[activeIndex];

  // Initialize Lenis smooth scroll and hook it to GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const rafHandler = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafHandler);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafHandler);
    };
  }, []);

  // 1. Core Page Entry animations
  useGSAP(() => {
    // Reveal top navbar and typography upwards
    const initTl = gsap.timeline();
    initTl.fromTo(
      '.hero-intro-text',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out', stagger: 0.25 }
    );
    
    // Scale and spin Pizza in
    initTl.fromTo(
      pizzaContainerRef.current,
      { scale: 0.7, opacity: 0, rotation: -240 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.8, ease: 'elastic.out(0.85, 0.6)' },
      '-=1.2'
    );

    // Staggered dropping of all structural ingredients
    initTl.fromTo(
      '.floating-ingredient-wrapper',
      { y: -100, opacity: 0, scale: 0 },
      {
        y: 0,
        opacity: 1,
        scale: (i, el) => parseFloat((el as HTMLElement).getAttribute('data-scale') || '1'),
        duration: 1.5,
        ease: 'bounce.out',
        stagger: {
          each: 0.08,
          from: 'random'
        }
      },
      '-=1.4'
    );

    // Fade and scale details
    initTl.fromTo('.action-cta-wrap', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8');

    // 2. Slow continuous relative floating of each ingredient (ambient organic loops)
    INVENTURIED_INGREDIENTS.forEach((ing) => {
      const el = ingredientsRefs.current[ing.id];
      if (el) {
        // Double nest: float the inner element to preserve positioning properties
        const innerImg = el.querySelector('.ingredient-inner-graphic');
        if (innerImg) {
          gsap.to(innerImg, {
            y: () => 'random(-15, 15)',
            x: () => 'random(-10, 10)',
            rotation: () => 'random(-25, 25)',
            duration: `random(4.5, 7.5)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            overwrite: 'auto'
          });
        }
      }
    });

    // 3. Constant slow ambient spinning on the physical Pizza itself
    gsap.to(pizzaInnerRef.current, {
      rotation: 360,
      duration: 110,
      repeat: -1,
      ease: 'none',
    });

    // 4. Scroll Trigger Interactive Timeline
    // As user scrolls, elements translate elegantly out of bounds
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1, // Smooth dragging action
        pin: false,
      }
    });

    scrollTl
      .to('.hero-text-container', { y: -120, opacity: 0, ease: 'power1.inOut' }, 0)
      .to('.scroll-hint', { opacity: 0, scale: 0.8, ease: 'power1.inOut' }, 0)
      .to(bgTextRef.current, { y: -60, scale: 0.9, opacity: 0, ease: 'power1.inOut' }, 0)
      .to(pizzaContainerRef.current, { y: 180, scale: 0.8, rotation: 70, opacity: 0.5, ease: 'power2.out' }, 0)
      .to('.action-cta-wrap', { y: 100, opacity: 0, ease: 'power2.in' }, 0);

    // Diagonally scatter the active ingredients depending on their quadrant location
    INVENTURIED_INGREDIENTS.forEach((ing) => {
      const el = ingredientsRefs.current[ing.id];
      if (el) {
        const quadrantX = ing.x > 50 ? 250 : -250;
        const quadrantY = ing.y > 50 ? 200 : -250;
        
        scrollTl.to(el, {
          x: quadrantX * (ing.depth === 1 ? 1.5 : 0.8),
          y: quadrantY * (ing.depth === 1 ? 1.5 : 0.8),
          opacity: 0,
          scale: 0.2,
          rotation: ing.rotation * 4,
          ease: 'power2.out'
        }, 0);
      }
    });

    // 5. Scroll Trigger Brand Section animations (play once on scroll entry)
    const parlorScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#about-parlor-section',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      }
    });

    // Pizza rolls in from far left
    parlorScrollTl.fromTo('.scroll-parlor-pizza',
      { x: -150, rotation: -60, opacity: 0 },
      { x: 0, rotation: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
    );

    // Heading slides in from right side
    parlorScrollTl.fromTo('.scroll-parlor-heading',
      { x: 150, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
      '-=0.9'
    );

    // Parallax animate the Tomato sticking out from right
    gsap.fromTo('.scroll-parlor-tomato',
      { y: 150 },
      {
        y: -150,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about-parlor-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );

    // Constant glowing ambient floating loop for colored background dots
    gsap.fromTo('.parlor-floating-dot',
      { x: 'random(-15, 15)', y: 'random(-15, 15)', scale: 'random(0.9, 1.1)' },
      {
        x: 'random(-45, 45)',
        y: 'random(-45, 45)',
        duration: 'random(6, 12)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 2,
          from: 'random'
        }
      }
    );

    // Scroll Trigger Popular Pizza Section animations (play once on scroll entry)
    const signatureScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#signature-pizza-section',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      }
    });

    // Elegant text slide in
    signatureScrollTl.fromTo('.scroll-signature-header',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    // Stagger slide entry for the beautiful cards
    signatureScrollTl.fromTo('.scroll-signature-card',
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out', stagger: 0.15 },
      '-=0.4'
    );

    // Continuous floating ambient loop for signature colored dots
    gsap.fromTo('.signature-floating-dot',
      { x: 'random(-12, 12)', y: 'random(-12, 12)', scale: 'random(0.9, 1.1)' },
      {
        x: 'random(-40, 40)',
        y: 'random(-40, 40)',
        duration: 'random(5, 10)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 1.5,
          from: 'random'
        }
      }
    );

    // Scroll Trigger All Flavors Section animations (play once on scroll entry)
    const flavorsScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#all-flavors-section',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      }
    });

    flavorsScrollTl.fromTo('.scroll-flavors-header',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    flavorsScrollTl.fromTo('.scroll-flavors-card',
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out', stagger: 0.15 },
      '-=0.4'
    );

    // Scroll Trigger Why Choose Us Section animations (play once on scroll entry)
    const whyScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#why-choose-us',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      }
    });

    whyScrollTl.fromTo('.scroll-why-header',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    whyScrollTl.fromTo('.scroll-why-item',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
      '-=0.5'
    );

    whyScrollTl.fromTo('.scroll-why-tomato',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.2)' },
      '-=0.6'
    );

    // Scroll Trigger Testimonials Section animations (play once on scroll entry)
    const testScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#testimonials-section',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      }
    });

    testScrollTl.fromTo('.scroll-test-left',
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    testScrollTl.fromTo('.scroll-test-center',
      { scale: 0.8, opacity: 0, rotation: -10 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.0, ease: 'back.out(1.2)' },
      '-=0.6'
    );

    testScrollTl.fromTo('.scroll-test-right',
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.8'
    );

    // Clean up ScrollTrigger events
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: mainContainerRef });

  // 5. Normal Interactive Core: Pointer mouse coordinate parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mainContainerRef.current) return;
    const rect = mainContainerRef.current.getBoundingClientRect();
    
    // Normalized vectors: range -0.5 to 0.5
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply micro parallax based on the depth index of the layer
    INVENTURIED_INGREDIENTS.forEach((ing) => {
      const el = ingredientsRefs.current[ing.id];
      if (el) {
        const factor = ing.depth === 1 ? 55 : ing.depth === 2 ? -30 : 15;
        gsap.to(el, {
          x: normX * factor,
          y: normY * factor,
          ease: 'power2.out',
          duration: 1.4,
          overwrite: 'auto'
        });
      }
    });

    // Subtle 3D tilting on the pizza base
    if (pizzaContainerRef.current) {
      gsap.to(pizzaContainerRef.current, {
        x: normX * 25,
        y: normY * 15,
        rotationY: normX * 20,
        rotationX: normY * -20,
        ease: 'power2.out',
        duration: 1.2,
        overwrite: 'auto'
      });
    }

    // Gentle text sliding Parallax
    if (bgTextRef.current) {
      gsap.to(bgTextRef.current, {
        x: normX * -50,
        y: normY * -30,
        ease: 'power2.out',
        duration: 1.6,
        overwrite: 'auto'
      });
    }
  };

  // Reset coordinates when mouse leaves viewport to align perfectly
  const handleMouseLeave = () => {
    INVENTURIED_INGREDIENTS.forEach((ing) => {
      const el = ingredientsRefs.current[ing.id];
      if (el) {
        gsap.to(el, { x: 0, y: 0, ease: 'power2.out', duration: 1.5, overwrite: 'auto' });
      }
    });

    if (pizzaContainerRef.current) {
      gsap.to(pizzaContainerRef.current, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        ease: 'power2.out',
        duration: 1.5,
        overwrite: 'auto'
      });
    }

    if (bgTextRef.current) {
      gsap.to(bgTextRef.current, { x: 0, y: 0, ease: 'power2.out', duration: 1.5, overwrite: 'auto' });
    }
  };

  // 6. Sliding transition: Switch pizzas
  const handleSliderChange = (direction: 'next' | 'prev') => {
    if (isLocked) return;
    setIsLocked(true);

    const len = PIZZAS.length;
    let nextIndex = activeIndex;
    if (direction === 'next') {
      nextIndex = (activeIndex + 1) % len;
    } else {
      nextIndex = (activeIndex - 1 + len) % len;
    }

    const nextPizza = PIZZAS[nextIndex];
    // Prep rotation angles: opposite directions
    const outRotVal = direction === 'next' ? -220 : 220;
    const inRotVal = direction === 'next' ? 220 : -220;

    const navTl = gsap.timeline({
      onComplete: () => {
        setIsLocked(false);
      }
    });

    // Fade/scale/rotate pizza OUT
    navTl.to(pizzaContainerRef.current, {
      scale: 0.6,
      opacity: 0,
      rotation: outRotVal,
      duration: 0.65,
      ease: 'power2.in',
      onComplete: () => {
        // Swap state halfway for smooth appearance
        setActiveIndex(nextIndex);
      }
    });

    // Fade/scale title and values
    navTl.to('.hero-fader-content', {
      opacity: 0,
      y: -15,
      duration: 0.25,
      ease: 'power1.in',
      stagger: 0.05
    }, 0);

    // Rotate out/fade currently unneeded ingredients
    const activeIngEls = INVENTURIED_INGREDIENTS.map(ing => ingredientsRefs.current[ing.id]);
    navTl.to(activeIngEls, {
      scale: 0.2,
      opacity: 0,
      y: direction === 'next' ? 100 : -100,
      duration: 0.5,
      ease: 'power2.in',
      stagger: 0.02
    }, 0);

    // --- AFTER MIDPOINT STATE ADJUSTMENT ---
    // Instantly teleport the incoming pizza to ready positioning
    navTl.set(pizzaContainerRef.current, {
      scale: 0.6,
      rotation: inRotVal,
    });

    // Bring elements back
    navTl.to(pizzaContainerRef.current, {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 1.15,
      ease: 'elastic.out(0.85, 0.6)'
    });

    // Bring ingredients back (filtering showing those active for this pizza)
    navTl.to(activeIngEls, {
      scale: (i) => INVENTURIED_INGREDIENTS[i].scale,
      opacity: (i) => {
        // Only show if present in this pizza's ingredient list
        const type = INVENTURIED_INGREDIENTS[i].type;
        return nextPizza.ingredients.includes(type) ? 1 : 0.15; // Low opacity transparent fade for unlisted
      },
      y: 0,
      duration: 0.95,
      ease: 'back.out(1.5)',
      stagger: {
        each: 0.04,
        from: 'center'
      }
    }, '-=0.7');

    // Fade in text detail
    navTl.to('.hero-fader-content', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.08
    }, '-=0.75');
  };

  // 7. Auto rotating pizza option: rotates to next flavor every 9 seconds, resets on button touches
  useEffect(() => {
    const timer = setInterval(() => {
      // Auto-clicks next if not locked (actively animating)
      if (!isLocked) {
        handleSliderChange('next');
      }
    }, 9500);

    return () => clearInterval(timer);
  }, [activeIndex, isLocked]);

  // Handle addition to cart with fancy visual blast particles
  const triggerAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);

    // Create custom particle burst using standard JS/GSAP animation
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const blastParticles: HTMLDivElement[] = [];

    for (let i = 0; i < 18; i++) {
      const particle = document.createElement('div');
      particle.className = 'fixed pointer-events-none z-50 rounded-full flex items-center justify-center';
      
      // Select random colors based on theme
      const colors = ['#8E1F0D', '#C64A19', '#FEF08A', '#22C55E', '#FFECDA'];
      const bgColor = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.backgroundColor = bgColor;
      particle.style.width = `${Math.random() * 10 + 6}px`;
      particle.style.height = particle.style.width;
      particle.style.transform = `translate(${buttonRect.left + buttonRect.width / 2}px, ${buttonRect.top}px)`;
      
      document.body.appendChild(particle);
      blastParticles.push(particle);
    }

    // Blast particles outward and fade them towards the Cart bag in navbar
    const navCartBtn = document.getElementById('nav-cart-btn');
    const cartRect = navCartBtn?.getBoundingClientRect();

    gsap.timeline({
      onComplete: () => {
        setCartCount(prev => prev + 1);
        setIsAddingToCart(false);
        blastParticles.forEach(p => p.remove());

        // Punch/bounce cart button briefly
        if (navCartBtn) {
          gsap.timeline()
            .to(navCartBtn, { scale: 1.25, duration: 0.15, ease: 'power2.out' })
            .to(navCartBtn, { scale: 1, duration: 0.35, ease: 'bounce.out' });
        }
      }
    }).to(blastParticles, {
      x: () => (Math.random() - 0.5) * 200,
      y: () => (Math.random() - 0.5) * 150 - 100,
      scale: 1.5,
      rotate: () => Math.random() * 360,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.01
    }).to(blastParticles, {
      x: cartRect ? cartRect.left + cartRect.width / 2 - buttonRect.left : 0,
      y: cartRect ? cartRect.top + cartRect.height / 2 - buttonRect.top : -400,
      scale: 0.1,
      opacity: 0.2,
      duration: 0.8,
      ease: 'power3.inOut'
    }, '-=0.15');
  };

  return (
    <div
      ref={mainContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[180vh] w-full overflow-x-hidden antialiased transition-colors duration-1000 ease-out"
      style={{ backgroundColor: '#FFF2E5' }}
      id="id-master-page"
    >
      {/* Background Texture Overlay to match Natural Tones design theme */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.045] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-40" />

      {/* Decorative Warm Ambient Light Blooms */}
      <div className="absolute top-[-10vh] left-[-10vw] w-[45vw] h-[45vw] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none select-none z-0" />
      <div className="absolute top-[30vh] right-[-10vw] w-[50vw] h-[50vw] rounded-full bg-brand-secondary/10 blur-[150px] pointer-events-none select-none z-0" />

      {/* Elegant grid background pattern subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0 opacity-40" />

      {/* Premium Custom Cursor */}
      <CustomCursor />

      {/* Premium Navbar */}
      <Navbar cartCount={cartCount} />

      {/* FULL-SCREEN HERO STAGE */}
      <section
        id="hero-section"
        className="relative w-full h-[100vh] flex flex-col items-center justify-between pt-28 pb-12 overflow-hidden z-10 bg-gradient-to-b from-[#2B0601] via-[#5E1408] to-[#450901]"
      >
        {/* Giant Watermark Display Typography Behind Pizza - Large, bold and refined */}
        <div
          ref={bgTextRef}
          className="bk-text-fade absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none text-center w-full overflow-hidden"
        >
          <h2 className="font-display font-black text-[18vw] sm:text-[22vw] uppercase leading-none tracking-widest text-white/[0.04] select-none break-all whitespace-nowrap">
            {currentPizza.bgSymbol}
          </h2>
        </div>

        {/* Scattered Ingredient Parallax Layers */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {INVENTURIED_INGREDIENTS.map((ing) => {
            const isActive = currentPizza.ingredients.includes(ing.type);
            return (
              <div
                key={ing.id}
                ref={(el) => {
                  ingredientsRefs.current[ing.id] = el;
                }}
                data-scale={ing.scale}
                className="floating-ingredient-wrapper absolute origin-center pointer-events-auto cursor-pointer select-none"
                style={{
                  left: `${ing.x}%`,
                  top: `${ing.y}%`,
                  width: `${ing.scale * 4.5}rem`,
                  height: `${ing.scale * 4.5}rem`,
                  maxWidth: '120px',
                  maxHeight: '120px',
                  // Fallback scales before GSAP initialization, unlisted gets dimmed
                  opacity: isActive ? 1 : 0.15,
                  transform: `scale(${isActive ? ing.scale : ing.scale * 0.7})`,
                  filter: `drop-shadow(0 ${10 * ing.scale}px ${12 * ing.scale}px rgba(50, 10, 0, ${0.12 * ing.scale}))`,
                  transition: 'opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                {/* Embedded inner layout for relative floats */}
                <div className="ingredient-inner-graphic w-full h-full">
                  <img
                    src={REAL_INGREDIENT_IMAGES[ing.type]}
                    alt={ing.type}
                    className="w-full h-full object-contain transform hover:scale-115 transition-transform duration-300 pointer-events-none select-none"
                    style={{
                      filter: `drop-shadow(0 ${6 * ing.scale}px ${12 * ing.scale}px rgba(50, 10, 0, ${0.15 * ing.scale}))`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Editorial Content Above Pizza */}
        <div className="hero-text-container max-w-4xl mx-auto px-6 text-center z-10 flex flex-col items-center pt-8 sm:pt-12">
          <div className="hero-intro-text inline-flex items-center gap-1.5 mb-4 sm:mb-3">
            <span className="font-display font-bold text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#FFBC00]">
              CHEF'S SELECTION / {currentPizza.tagline}
            </span>
          </div>

          <h1 className="hero-intro-text font-serif italic text-4xl xs:text-5xl sm:text-6xl md:text-7xl tracking-tight text-[#FFECDA] leading-[1.12] max-w-3xl mb-8 text-balance">
            {currentPizza.displayName}
          </h1>

          {/* SINGLE CTA & ADD TO CART BAR */}
          <div className="action-cta-wrap w-full flex flex-col items-center gap-3 z-40">
            <button
              onClick={triggerAddToCart}
              disabled={isAddingToCart}
              className="group relative cursor-pointer font-display font-extrabold text-xs tracking-[0.2em] uppercase bg-[#FFBC00] text-[#380902] py-4.5 px-10 sm:px-14 rounded-full border border-amber-400/20 shadow-[0_15px_40px_rgba(255,188,0,0.15)] hover:bg-white transition-all duration-300 tracking-widest disabled:opacity-85 select-none overflow-hidden max-w-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              style={{
                boxShadow: `0 15px 35px rgba(255, 188, 0, 0.15)`
              }}
              id="add-to-cart-btn"
            >
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-white to-[#FFECDA] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isAddingToCart ? (
                  <>
                    <Sparkles size={14} className="animate-spin text-stone-900" />
                    <span className="text-stone-900">PREPARING...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} className="group-hover:scale-110 transition-transform duration-300 text-[#380902]" />
                    <span className="text-[#380902]">ADD TO CART</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* ROTATING CENTRAL STAGE PIZZA & TIMELINE AT THE SCREEN BOTTOM */}
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] sm:h-[45vh] md:h-[50vh] flex items-end justify-center z-30 select-none overflow-visible">
          {/* Main Outer Pizza wrap (handles slides and tilt parallax) */}
          <div
            ref={pizzaContainerRef}
            className="pizza-outer-wrap absolute aspect-square w-[90vw] sm:w-[75vw] md:w-[65vw] max-w-[560px] left-0 right-0 mx-auto bottom-[-45vw] xs:bottom-[-48vw] sm:bottom-[-37vw] md:bottom-[-280px] origin-center z-20 flex items-center justify-center"
            style={{
              filter: 'drop-shadow(0 -15px 50px rgba(0,0,0,0.3))'
            }}
          >
            {/* Main Inner Pizza Image (handles continuous slow ambient spins) */}
            <img
              ref={pizzaInnerRef}
              src={currentPizza.imageUrl}
              alt={currentPizza.displayName}
              className="pizza-inner-image w-full h-full object-cover rounded-full select-none pointer-events-none"
              style={{
                clipPath: 'circle(50% at 50% 50%)',
              }}
            />
          </div>

          {/* Slider Arrow Left */}
          <button
            onClick={() => handleSliderChange('prev')}
            disabled={isLocked}
            className="absolute bottom-10 left-6 sm:left-12 lg:left-24 w-12 h-12 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#380902] shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-50 select-none z-40 active:scale-95 shrink-0"
            aria-label="Previous Pizza Flavor"
            id="prev-pizza-btn"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>

          {/* Slider Arrow Right */}
          <button
            onClick={() => handleSliderChange('next')}
            disabled={isLocked}
            className="absolute bottom-10 right-6 sm:right-12 lg:right-24 w-12 h-12 rounded-full bg-[#FFBC00] text-[#380902] border border-amber-400/10 hover:bg-white hover:text-[#380902] shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-50 select-none z-40 active:scale-95 shrink-0"
            aria-label="Next Pizza Flavor"
            id="next-pizza-btn"
          >
            <ChevronRight size={20} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Scroll down hint indicators */}
        <div className="scroll-hint absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 z-40 select-none opacity-40 hover:opacity-80 transition-opacity">
          <span className="font-sans font-bold text-[8px] tracking-[0.25em] text-white/60 uppercase">
            SCROLL DOWN
          </span>
        </div>
      </section>

      {/* THE TRANSITIONAL CURVED SECTION & INGREDIENT SHOWCASE */}
      <section
        id="menu-showcase-section"
        className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-white z-30"
      >
        {/* Dynamic Curved Divider dipping elegantly in center */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none select-none -translate-y-[99%]">
          <svg
            viewBox="0 0 1440 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[14vh] min-h-[70px] drop-shadow-[0_-5px_15px_rgba(100,20,0,0.02)]"
            preserveAspectRatio="none"
          >
            <path d="M 0 0 C 480 200, 960 200, 1440 0 L 1440 200 L 0 200 Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Scattered Real Parsleys and Chilis on curve boundaries */}
        <div className="absolute top-[-75px] left-[15%] w-10 sm:w-16 h-auto pointer-events-none select-none z-30 opacity-90 rotate-[15deg] transition-all">
          <img src={PARSLEY_SPRIG_IMAGE} alt="Parsley Sprig" className="w-full object-contain" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }} />
        </div>
        <div className="absolute top-[-45px] left-[32%] w-6 sm:w-10 h-auto pointer-events-none select-none z-30 opacity-95 rotate-[-45deg]">
          <img src={CHILI_IMAGE} alt="Chili Flake" className="w-full object-contain" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }} />
        </div>
        <div className="absolute top-[-65px] right-[25%] w-10 sm:w-14 h-auto pointer-events-none select-none z-30 opacity-90 rotate-[110deg]">
          <img src={PARSLEY_LEAF_IMAGE} alt="Parsley Leaf" className="w-full object-contain" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }} />
        </div>
        <div className="absolute top-[-90px] right-[40%] w-7 sm:w-11 h-auto pointer-events-none select-none z-30 opacity-95 rotate-[35deg]">
          <img src={CHILI_IMAGE} alt="Chili piece" className="w-full object-contain" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }} />
        </div>

        {/* Realistic left red bell pepper hanging off margin */}
        <div className="absolute left-[-25px] sm:left-[-45px] md:left-[-65px] top-[140px] w-24 sm:w-36 md:w-44 lg:w-56 h-auto pointer-events-none select-none z-20 rotate-[-12deg] hover:rotate-[-4deg] transition-transform duration-1000 ease-out" style={{ filter: 'drop-shadow(0 25px 45px rgba(100,10,0,0.14))' }}>
          <img src={PEPPER_RED_IMAGE} alt="Fresh Bell Pepper" className="w-full object-contain" />
        </div>

        {/* Floating circular visual custom ORDER NOW Badge right in the center slot */}
        <div className="absolute top-[-100px] sm:top-[-115px] left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-auto">
          <div className="absolute w-[116px] h-[116px] sm:w-[136px] sm:h-[136px] rounded-full bg-[#E5B54F]/20 border-2 border-[#E5B54F] translate-y-2 translate-x-1 opacity-80 blur-[0.5px]" />
          <div className="absolute w-[112px] h-[112px] sm:w-[132px] sm:h-[132px] rounded-full bg-[#D4A33B] translate-y-1 opacity-90" />
          
          <button
            onClick={() => {
              const target = document.getElementById('about-parlor-section');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="group relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] rounded-full bg-white shadow-[0_15px_30px_rgba(100,20,0,0.12)] flex flex-col items-center justify-center cursor-pointer border border-[#EBE3D7] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
          >
            <div className="absolute top-[-8px] w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md group-hover:bg-brand-secondary group-hover:translate-y-[-2px] transition-all">
              <ArrowRight size={13} className="stroke-[3]" />
            </div>
            <span className="font-bebas text-2xl sm:text-3xl tracking-wide text-brand-primary leading-none mt-4 group-hover:text-brand-secondary transition-colors">
              ORDER
            </span>
            <span className="font-bebas text-2xl sm:text-3xl tracking-wide text-[#59140B] leading-none mt-0.5">
              NOW
            </span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col items-center relative z-20">
          {/* Main Title of Subsection - THE TRUE TASTE OF ITALY */}
          <div className="text-center mb-16 sm:mb-20 flex flex-col items-center max-w-3xl">
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wide text-brand-primary leading-none select-none uppercase">
              THE TRUE TASTE OF ITALY
            </h2>
            <div className="w-14 h-[3px] bg-brand-secondary/30 rounded-full mt-4" />
          </div>

          {/* Elegant Horizontal Category Toolbar with vertical dividers */}
          <div className="w-full max-w-5xl bg-white border border-[#EBE3D7] rounded-3xl shadow-[0_20px_50px_rgba(142,31,13,0.04)] overflow-hidden mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-[#EBE3D7]">
              {[
                { id: 'pizza', label: 'PIZZA', iconName: 'pizza' },
                { id: 'burgers', label: 'BURGERS', iconName: 'burger' },
                { id: 'salad', label: 'SALAD', iconName: 'salad' },
                { id: 'fries', label: 'FRIES', iconName: 'fries' },
                { id: 'drinks', label: 'DRINKS', iconName: 'drinks' },
                { id: 'chicken', label: 'CHICKEN', iconName: 'chicken' },
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`group flex flex-col items-center justify-center p-6 transition-all duration-300 focus:outline-none cursor-pointer ${
                      isActive
                        ? 'bg-brand-accent/50 text-brand-secondary'
                        : 'bg-white hover:bg-[#FFF9F3]/60 text-brand-primary/80 hover:text-brand-primary'
                    }`}
                  >
                    <div className={`mb-3.5 transform transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-105' : 'opacity-85'}`}>
                      {cat.iconName === 'pizza' && (
                        <svg viewBox="0 0 100 100" className="w-11 h-11 pointer-events-none" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 30 L85 30 C80 55, 65 75, 50 85 C35 75, 20 55, 15 30 Z" />
                          <path d="M15 30 Q50 36 85 30" />
                          <circle cx="40" cy="45" r="3.5" fill="currentColor" />
                          <circle cx="60" cy="45" r="3.5" fill="currentColor" />
                          <circle cx="51" cy="62" r="3.5" fill="currentColor" />
                        </svg>
                      )}
                      {cat.iconName === 'burger' && (
                        <svg viewBox="0 0 100 100" className="w-11 h-11 pointer-events-none" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 50 Q50 20 80 50 Z" />
                          <path d="M15 57 L85 57 C85 57, 85 64, 85 64 H15 Z" />
                          <path d="M20 71 Q50 85 80 71" />
                          <path d="M20 71 L20 64 H80 L80 71" />
                        </svg>
                      )}
                      {cat.iconName === 'salad' && (
                        <svg viewBox="0 0 100 100" className="w-11 h-11 pointer-events-none" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 45 C15 45, 15 75, 50 75 C85 75, 85 45, 85 45 Z" />
                          <path d="M10 45 L90 45" />
                          <path d="M30 45 C25 35, 35 25, 45 35 C45 35, 55 20, 65 35 C75 30, 80 40, 75 45" />
                        </svg>
                      )}
                      {cat.iconName === 'fries' && (
                        <svg viewBox="0 0 100 100" className="w-11 h-11 pointer-events-none" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M25 45 L30 80 H70 L75 45 Z" />
                          <path d="M20 45 Q50 49 80 45" />
                          <rect x="33" y="24" width="5" height="23" rx="1" />
                          <rect x="43" y="19" width="5" height="28" rx="1" />
                          <rect x="53" y="21" width="5" height="26" rx="1" />
                          <rect x="63" y="25" width="5" height="22" rx="1" />
                        </svg>
                      )}
                      {cat.iconName === 'drinks' && (
                        <svg viewBox="0 0 100 100" className="w-11 h-11 pointer-events-none" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="20" y="55" width="60" height="25" rx="1.5" />
                          <line x1="20" y1="67" x2="80" y2="67" />
                          <path d="M32 55 V35 C32 30, 36 28, 36 24 V20 H44 V24 C44 28, 48 30, 48 35 V55" />
                          <path d="M52 55 V35 C52 30, 56 28, 56 24 V20 H64 V24 C64 28, 68 30, 68 35 V55" />
                        </svg>
                      )}
                      {cat.iconName === 'chicken' && (
                        <svg viewBox="0 0 100 100" className="w-11 h-11 pointer-events-none" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M25 75 C18 78, 14 70, 18 64 L40 40" />
                          <circle cx="15" cy="72" r="4.5" fill="currentColor" />
                          <circle cx="21" cy="78" r="4.5" fill="currentColor" />
                          <path d="M35 45 C35 30, 50 15, 68 22 C82 28, 85 45, 75 60 C65 72, 50 72, 42 62 C38 57, 35 51, 35 45 Z" />
                        </svg>
                      )}
                    </div>
                    <span className="font-bebas text-lg tracking-widest leading-none select-none">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE CATEGORY SHOWCASE (EDITORIAL CRAFT NOTEBOOK - NO EXPLICIT PRODUCTS GRAPH) */}
          <div className="w-full max-w-5xl">
            {(() => {
              const currentStory = CATEGORIES_STORY_DATA[selectedCategory] || CATEGORIES_STORY_DATA.pizza;
              return (
                <div
                  key={selectedCategory}
                  className="flex flex-col md:flex-row items-stretch gap-8 sm:gap-12 bg-[#FCFAF6] border border-[#EBE3D7]/60 rounded-3xl p-6 sm:p-10 shadow-[0_15px_40px_rgba(142,31,13,0.02)]"
                >
                  {/* Left Column: Interactive imagery framed like high-end food review */}
                  <div className="w-full md:w-[45%] shrink-0 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src={currentStory.imageUrl}
                      alt={currentStory.title}
                      className="w-full h-full object-cover transform hover:scale-106 transition-transform duration-700 pointer-events-none select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-4 left-4 font-display font-medium text-[8px] tracking-[0.2em] text-white bg-brand-primary py-1.5 px-3.5 rounded-full uppercase select-none shadow-md">
                      {currentStory.badge}
                    </span>
                  </div>

                  {/* Right Column: Beautiful Stories and Cooking Specialties */}
                  <div className="flex flex-col justify-center text-left py-2">
                    <span className="font-display font-bold text-[9px] text-brand-secondary tracking-[0.3em] uppercase mb-1.5">
                      ARTISANAL DECK
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-extrabold italic text-brand-primary mb-4 leading-tight">
                      {currentStory.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-stone-400 mb-2">Via Appia Antica 15<br />Rome, 00118 IT</p>
                    <p className="font-sans text-xs sm:text-sm text-brand-primary/75 leading-relaxed mb-6">
                      {currentStory.story}
                    </p>

                    <div className="space-y-3 border-t border-[#EBE3D7]/50 pt-5">
                      <h4 className="font-display font-extrabold text-[9px] tracking-[0.15em] text-[#7A6051] uppercase mb-2">
                        METHOD SPECIALTIES
                      </h4>
                      {currentStory.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center text-brand-secondary shrink-0 select-none">
                            <span className="font-bebas text-xs">{idx + 1}</span>
                          </span>
                          <span className="font-sans font-semibold text-xs text-brand-primary/80">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* BRAND PARLOR & SCRUBBING GSAP ANIMATION SECTION */}
      <section
        id="about-parlor-section"
        className="relative w-full py-16 sm:py-24 px-6 sm:px-12 bg-white z-30 overflow-hidden border-t border-[#EBE3D7]/20"
      >
        {/* DESIGN LINES, FORMS, SHAPES & DYNAMIC EXTRA DOTS */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Subtle Golden Design Grid Blueprint Lining with Bright Colors */}
          <div className="absolute inset-x-0 top-0 h-full opacity-[0.28] select-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {/* Concentric subtle bright circular lines on left background behind pizza */}
              <circle cx="28%" cy="50%" r="220" stroke="#FFBC00" strokeWidth="1.5" strokeDasharray="6,8" fill="none" />
              <circle cx="28%" cy="50%" r="320" stroke="#FF5A36" strokeWidth="1.2" strokeDasharray="8,10" fill="none" />
              <circle cx="28%" cy="50%" r="420" stroke="#FFECDA" strokeWidth="2" fill="none" />

              {/* Matching concentric decorative circles on right background behind text */}
              <circle cx="74%" cy="50%" r="200" stroke="#FF5A36" strokeWidth="1" strokeDasharray="10,6" fill="none" opacity="0.3" />
              <circle cx="74%" cy="50%" r="290" stroke="#FFBC00" strokeWidth="1.5" strokeDasharray="5,8" fill="none" opacity="0.4" />
              <circle cx="74%" cy="50%" r="390" stroke="#EBE3D7" strokeWidth="1.5" fill="none" opacity="0.5" />
              
              {/* Vertical blueprint alignment lines */}
              <line x1="12%" y1="0" x2="12%" y2="100%" stroke="#FF5A36" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
              <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#FFBC00" strokeWidth="1" strokeDasharray="3,6" opacity="0.3" />
              <line x1="88%" y1="0" x2="88%" y2="100%" stroke="#C64A19" strokeWidth="1" strokeDasharray="2,4" opacity="0.3" />
              
              {/* Horizontal geometric alignment lines */}
              <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#FF5A36" strokeWidth="1" strokeDasharray="5,5" opacity="0.25" />
              <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#FFBC00" strokeWidth="1" strokeDasharray="5,5" opacity="0.25" />
            </svg>
          </div>

          {/* BRIGHT COLORED MOVING DOTS */}
          <div className="parlor-floating-dot absolute w-4 h-4 rounded-full bg-amber-400 blur-[0.5px] shadow-[0_0_15px_#F5C542]" style={{ left: '15%', top: '22%' }} />
          <div className="parlor-floating-dot absolute w-3.5 h-3.5 rounded-full bg-orange-500 blur-[0.5px] shadow-[0_0_12px_#FF5A36]" style={{ left: '38%', top: '15%' }} />
          <div className="parlor-floating-dot absolute w-5 h-5 rounded-full bg-emerald-500 blur-[1px] shadow-[0_0_16px_#10B981]" style={{ left: '10%', top: '75%' }} />
          <div className="parlor-floating-dot absolute w-4 h-4 rounded-full bg-red-500 blur-[0.5px] shadow-[0_0_15px_#EF4444]" style={{ left: '48%', top: '65%' }} />
          <div className="parlor-floating-dot absolute w-3.5 h-3.5 rounded-full bg-yellow-400 blur-[0.5px] shadow-[0_0_12px_#F5C542]" style={{ left: '72%', top: '12%' }} />
          <div className="parlor-floating-dot absolute w-4.5 h-4.5 rounded-full bg-orange-400 blur-[1px] shadow-[0_0_14px_#FB923C]" style={{ left: '84%', top: '78%' }} />
          <div className="parlor-floating-dot absolute w-3 h-3 rounded-full bg-rose-500 blur-[0.5px] shadow-[0_0_10px_#F43F5E]" style={{ left: '92%', top: '30%' }} />
          <div className="parlor-floating-dot absolute w-5 h-5 rounded-full bg-amber-500 blur-[1px] shadow-[0_0_18px_#F59E0B]" style={{ left: '55%', top: '85%' }} />

          {/* Bright energetic gradient splashes */}
          <div className="absolute top-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-br from-[#FFBB00]/15 to-orange-500/0 blur-[90px] select-none pointer-events-none" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-rose-500/12 to-[#FFBB00]/0 blur-[110px] select-none pointer-events-none" />
        </div>

        {/* Giant Yellow Distressed Background Text "DELICIOUS" */}
        <div className="absolute left-[3%] top-[30%] -translate-y-1/2 select-none pointer-events-none z-0 overflow-hidden w-full text-left">
          <span className="font-bebas text-[14vw] sm:text-[18vw] leading-none tracking-widest text-amber-400/12 select-none">
            DELICIOUS
          </span>
        </div>

        {/* Floating parallax tomato sticking out from right margin */}
        <div
          id="scroll-parlor-tomato"
          className="scroll-parlor-tomato absolute right-[-50px] sm:right-[-80px] md:right-[-120px] top-[15%] w-48 sm:w-64 md:w-80 lg:w-96 h-auto pointer-events-none select-none z-20"
          style={{
            filter: 'drop-shadow(0 25px 45px rgba(250,50,10,0.22))',
            willChange: 'transform'
          }}
        >
          <img
            src={PARLOR_TOMATO_IMAGE}
            alt="Organic Parallax Tomato"
            className="w-full object-contain"
            style={{ filter: 'drop-shadow(0 25px 45px rgba(250,50,10,0.25))' }}
          />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center relative z-10">
          
          {/* LEFT COLUMN: Clean wood board pizza (GSAP animated entry from left, back on scroll) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start relative z-10">
            <div className="scroll-parlor-pizza relative aspect-square w-[68vw] sm:w-[48vw] md:w-[38vw] lg:w-[27vw] max-w-[360px]">
              {/* Outer decorative halo layout with bright colors */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/[0.12] scale-105 pointer-events-none animate-[pulse_3s_infinite]" />
              <div className="absolute inset-0 rounded-full border border-dashed border-orange-500/[0.15] scale-110 pointer-events-none" />
              
              {/* Delicious High-Resolution Pizza in Brilliant Gold/Orange Plate Border */}
              <div
                className="w-full h-full p-2.5 rounded-full bg-gradient-to-tr from-[#FF7F00] via-[#FFD700] to-[#8E1F0D] shadow-[0_22px_55px_rgba(142,31,13,0.28)]"
              >
                <div className="w-full h-full rounded-full bg-white p-2 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=98&w=1000&auto=format&fit=crop"
                    alt="Authentic Italian Wood Fired Pizza"
                    className="w-full h-full object-cover rounded-full select-none pointer-events-none shadow-[0_10px_25px_rgba(100,20,0,0.18)] ring-1 ring-white"
                  />
                </div>
              </div>

              {/* OVERLAY SCALLOPED RED BADGE (bottom right of board scaled down proportionately) */}
              <div className="absolute bottom-[-1%] right-[-1%] z-20 flex items-center justify-center transform rotate-[14deg] hover:rotate-[22deg] transition-transform duration-300">
                <div className="relative w-[85px] h-[85px] sm:w-[105px] sm:h-[105px] rounded-full bg-brand-primary border-4 border-white shadow-[0_10px_20px_rgba(142,31,13,0.3)] flex flex-col items-center justify-center text-center p-2">
                  <div className="absolute inset-1 rounded-full border border-dashed border-white/40" />
                  <span className="font-display font-semibold text-[6px] sm:text-[7.5px] tracking-[0.2em] text-yellow-300 uppercase leading-none">
                    EST. 2026
                  </span>
                  <span className="font-bebas text-sm sm:text-base tracking-wide text-white leading-none mt-1 uppercase">
                    AUTHENTIC
                  </span>
                  <span className="font-bebas text-sm sm:text-base tracking-wide text-white leading-none mt-0.5 uppercase">
                    ITALIAN
                  </span>
                  <span className="font-display font-medium text-[5px] sm:text-[6.5px] tracking-[0.1em] text-white/70 uppercase leading-none mt-1.5">
                    ★ ★ ★ ★ ★
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Editorial brand texts (GSAP animated entry from left, back on scroll) */}
          <div className="scroll-parlor-heading lg:col-span-6 text-left flex flex-col items-start z-10 lg:pl-8">
            {/* Top red dash indicator label */}
            <div className="flex items-center gap-3 text-brand-secondary font-display font-black text-xs sm:text-sm tracking-[0.25em] mb-4">
              <span className="w-10 h-[2.5px] bg-brand-secondary rounded-full shrink-0" />
              <span className="uppercase tracking-[0.3em] font-extrabold text-orange-600">BEST ITALIAN FOOD FOR YOUR FAMILY</span>
            </div>

            {/* Bold Display Heading with bright gradient highlights */}
            <h2 className="font-bebas text-[48px] sm:text-[62px] md:text-[76px] lg:text-[84px] tracking-wide text-brand-primary leading-[0.95] mb-6 uppercase">
              THE AMAZING <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">PASTA & PIZZA</span> PARLOR.
            </h2>

            {/* Paragraph description */}
            <p className="font-sans text-brand-primary/80 text-sm sm:text-base leading-relaxed max-w-xl mb-9">
              All about quality you can trust. As one of the original founding pizza brands and the 3rd largest pizza chain, our sole mission is making the freshest, tastiest.
            </p>

            {/* Actions list */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <button
                onClick={() => {
                  const target = document.getElementById('menu-showcase-section');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-[#242424] hover:bg-brand-primary text-[#fff] font-display font-extrabold text-[10px] tracking-[0.2em] uppercase py-4.5 px-8 rounded-full shadow-[0_12px_30px_-5px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer select-none focus:outline-none"
              >
                ABOUT RESTAURANT
              </button>
              
              <a
                href="tel:1800222000"
                className="group flex items-center gap-3 text-brand-secondary hover:text-brand-primary font-display font-black text-[#C64A19] text-base sm:text-lg tracking-widest transition-all select-none cursor-pointer"
              >
                <span className="w-10 h-10 rounded-full border-2 border-brand-secondary/20 group-hover:border-brand-primary/30 flex items-center justify-center shrink-0 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2.5] transform group-hover:rotate-12 transition-transform" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span className="group-hover:translate-x-0.5 transition-transform">1 800 222 000</span>
              </a>
            </div>
          </div>

          {/* Absolute Bottom Features Grid */}
          <div className="lg:col-span-12 border-t border-brand-primary/10 pt-16 mt-12 sm:mt-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="flex items-center gap-5 sm:gap-6 group text-left">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#EBE3D7] hover:border-brand-primary/25 shadow-xs flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-xs">
                    {/* Delivery Box Icon */}
                    <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-none stroke-current stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bebas text-xl sm:text-2xl tracking-wider text-brand-primary leading-none mb-1">FAST DELIVERY</h4>
                  <p className="font-sans text-[10px] text-brand-primary/60 uppercase tracking-widest font-extrabold leading-tight">Within 30 minutes</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-5 sm:gap-6 group text-left">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#EBE3D7] hover:border-brand-primary/25 shadow-xs flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-xs">
                    {/* Shopping Bag with Tick Icon */}
                    <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-none stroke-current stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                      <polyline points="9 14 11 16 15 12" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bebas text-xl sm:text-2xl tracking-wider text-brand-primary leading-none mb-1">PICKUP DELIVERY</h4>
                  <p className="font-sans text-[10px] text-brand-primary/60 uppercase tracking-widest font-extrabold leading-tight">Grab your food order</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-5 sm:gap-6 group text-left">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#EBE3D7] hover:border-brand-primary/25 shadow-xs flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-xs">
                    {/* Award Medal Ribbon Icon */}
                    <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-none stroke-current stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bebas text-xl sm:text-2xl tracking-wider text-brand-primary leading-none mb-1">ABSOLUTE DINING</h4>
                  <p className="font-sans text-[10px] text-brand-primary/60 uppercase tracking-widest font-extrabold leading-tight">Best buffet restaurant</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SIGNATURE PIZZA & POPULAR SELECTION SECTION */}
      <section
        id="signature-pizza-section"
        className="relative w-full py-28 sm:py-36 bg-[#FFF9F2] z-30 overflow-hidden border-t border-[#F2E5D5]"
      >
        {/* DESIGN LINES, FORMS, SHAPES & DYNAMIC EXTRA DOTS (ORGANIC WAVES IN BACKGROUND) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Wave Decor 1: Soft flowing top-left curve */}
          <svg className="absolute top-0 left-0 w-[60%] h-[50%] opacity-[0.55]" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100,50 C200,100 350,-50 550,120 C700,250 580,420 850,480 L850,0 L-100,0 Z" fill="#F7EBE1" />
          </svg>

          {/* Wave Decor 2: Gentle fluid sweep from right-to-left */}
          <svg className="absolute bottom-0 right-0 w-[70%] h-[60%] opacity-[0.6]" viewBox="0 0 900 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1000,500 C700,450 620,620 400,520 C220,440 310,250 -100,280 L-100,700 L1000,700 Z" fill="#F4E6D9" />
          </svg>

          {/* Wave Decor 3: Very subtle central blob shadow representing premium taste shapes */}
          <svg className="absolute top-[25%] left-[20%] w-[50%] h-[45%] opacity-[0.25]" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,150 C180,50 350,80 480,180 C550,230 460,350 320,320 C180,300 120,380 50,150 Z" fill="#EADCCF" />
          </svg>

          {/* BRIGHT COLORED MOVING AMBIENT DOTS */}
          <div className="signature-floating-dot absolute w-3.5 h-3.5 rounded-full bg-amber-400 blur-[0.5px] shadow-[0_0_12px_#F5C542]" style={{ left: '9%', top: '24%' }} />
          <div className="signature-floating-dot absolute w-3 h-3 rounded-full bg-orange-500 blur-[0.5px] shadow-[0_0_10px_#FF5A36]" style={{ left: '25%', top: '16%' }} />
          <div className="signature-floating-dot absolute w-4.5 h-4.5 rounded-full bg-emerald-500 blur-[1px] shadow-[0_0_14px_#34D399]" style={{ left: '11%', top: '78%' }} />
          <div className="signature-floating-dot absolute w-3.5 h-3.5 rounded-full bg-red-400 blur-[0.5px] shadow-[0_0_12px_#EF4444]" style={{ left: '44%', top: '72%' }} />
          <div className="signature-floating-dot absolute w-3 h-3 rounded-full bg-yellow-400 blur-[0.5px] shadow-[0_0_10px_#F5C542]" style={{ left: '78%', top: '15%' }} />
          <div className="signature-floating-dot absolute w-4 h-4 rounded-full bg-orange-400 blur-[1px] shadow-[0_0_12px_#FB923C]" style={{ left: '89%', top: '80%' }} />
          <div className="signature-floating-dot absolute w-3.5 h-3.5 rounded-full bg-amber-500 blur-[1px] shadow-[0_0_15px_#F59E0B]" style={{ left: '57%', top: '84%' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* HEADER: Layout matches the horizontal split layout from first image */}
          <div className="scroll-signature-header flex flex-col sm:flex-row items-center justify-center text-center sm:text-left mb-24 sm:mb-28 sm:divide-x sm:divide-brand-primary/20">
            <span className="font-bebas text-3xl sm:text-4xl tracking-[0.25em] text-[#C64A19] uppercase sm:pr-8 mb-4 sm:mb-0">
              OUR SIGNATURE
            </span>
            <h2 className="font-bebas text-5xl sm:text-7xl tracking-wide text-brand-primary uppercase sm:pl-8 leading-none">
              POPULAR PIZZA
            </h2>
          </div>

          {/* GRID: Four clean responsive columns adjusted for laptop screen */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 sm:px-2 mt-8">
            {[
              {
                id: "sig-1",
                name: "Margherita",
                rating: 4,
                description: "Classic cheese & tomato delight",
                discountPrice: "$19.00",
                imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=85&w=600&auto=format&fit=crop",
              },
              {
                id: "sig-2",
                name: "Veggie Supreme",
                rating: 3,
                description: "Loaded with fresh vegetables & herbs",
                discountPrice: "$18.00",
                imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=85&w=600&auto=format&fit=crop",
              },
              {
                id: "sig-3",
                name: "Pepperoni Passion",
                rating: 4,
                description: "Topped with spicy pepperoni slices",
                discountPrice: "$20.00",
                imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=85&w=600&auto=format&fit=crop",
              },
              {
                id: "sig-4",
                name: "Farmhouse",
                rating: 5,
                description: "Onions, capsicum, mushrooms & sweet corn",
                discountPrice: "$16.00",
                badge: "HOT",
                imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=85&w=600&auto=format&fit=crop",
              }
            ].map((item) => (
              <div
                key={item.id}
                className="scroll-signature-card bg-white rounded-[24px] lg:rounded-[28px] p-3 pb-5 pt-12 md:p-4 md:pb-5 md:pt-14 lg:p-4 lg:pb-5 lg:pt-14 xl:p-5 xl:pb-6 xl:pt-16 border border-[#EBE3D7]/50 shadow-[0_10px_25px_rgba(40,20,5,0.03)] hover:shadow-[0_24px_50px_rgba(150,40,15,0.11)] transition-all duration-500 hover:-translate-y-3 flex flex-col relative group overflow-visible mt-12"
              >
                {/* 1. SEPARATE OVERLAPPING FLOAT PIZZA DISH IMAGE with exact top hanging styling */}
                <div className="absolute -top-10 lg:-top-12 xl:-top-14 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 lg:w-24 lg:h-24 xl:w-28 xl:h-28 z-20">
                  {/* Dense Realistic Bottom Cast shadow of the dish */}
                  <div className="absolute inset-1 bg-black/14 blur-md rounded-full -bottom-1 group-hover:bg-amber-800/18 group-hover:blur-lg transition-all duration-500" />
                  
                  {/* Clean Crispy Pizza Dish Ring Frame */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full select-none pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-[15deg] shadow-[0_8px_16px_rgba(0,0,0,0.14)] ring-4 ring-white relative z-10"
                  />

                  {/* CUSTOM CORNER HOT badge on Farmhouse Pizza */}
                  {item.badge && (
                    <div className="absolute -right-1 top-0 z-30 transform rotate-[12deg] group-hover:scale-115 transition-transform duration-300">
                      <div className="relative flex items-center justify-center bg-[#D64423] text-white font-sans font-black text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-[4px] shadow-[0_3px_8px_rgba(214,68,35,0.4)] uppercase tracking-wider before:content-[''] before:absolute before:inset-0 before:bg-white/10 before:rounded-sm animate-[pulse_2s_infinite]">
                        {item.badge}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. NAME TYPOGRAPHY & SPACING */}
                <div className="text-center mt-2.5 mb-1">
                  <h3 className="font-sans font-extrabold text-stone-800 text-[15px] sm:text-[17px] lg:text-[16px] xl:text-[18px] tracking-tight hover:text-[#C64A19] transition-colors duration-300 mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  {/* Description underneath */}
                  <p className="text-[11px] sm:text-[12px] lg:text-[11px] xl:text-[12px] text-stone-500 leading-normal max-w-[160px] sm:max-w-[180px] mx-auto min-h-[32px] sm:min-h-[36px] flex items-center justify-center line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* 3. CENTERED Row of Yellow Stars Rating layout */}
                <div className="flex items-center justify-center gap-0.5 mt-1 mb-4 select-none">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                        idx < item.rating
                          ? 'text-[#FFC72C] fill-[#FFC72C]'
                          : 'text-stone-200 fill-stone-200'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                {/* 4. HORIZONTAL SPLIT - PRICING ROW (Price on left, Rust Pill Button "Buy Now" on right) */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#FAF1E4]">
                  <div className="text-left">
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-stone-400 leading-none mb-0.5">PRICE</span>
                    <span className="text-[#2C2C2C] font-black text-[14px] sm:text-[16px] lg:text-[15px] xl:text-[18px] tracking-tight">
                      {item.discountPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCartCount(prev => prev + 1);
                      setIsAddingToCart(true);
                      setTimeout(() => setIsAddingToCart(false), 800);
                    }}
                    className="px-2.5 py-1 sm:px-4 sm:py-1.5 bg-[#B2492D] text-white hover:bg-stone-850 rounded-full font-sans font-bold text-[10px] sm:text-[11px] lg:text-[10px] xl:text-[12px] tracking-wide transition-all duration-300 relative overflow-hidden flex items-center justify-center cursor-pointer shadow-sm shadow-orange-700/5 hover:-translate-y-0.5 focus:outline-none"
                  >
                    Buy Now
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* BOTTOM: Giant SIGNATURE backdrop and overlay round EXPLORE badge */}
          <div className="relative mt-20 sm:mt-24 h-40 sm:h-48 flex items-center justify-center select-none overflow-visible">
            {/* Giant Background Word */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <span className="font-bebas text-[14vw] sm:text-[16vw] leading-none tracking-[0.2em] text-[#C64A19]/8 uppercase">
                SIGNATURE
              </span>
            </div>

            {/* Overlapping rounded button EXPLORE */}
            <button
              onClick={() => {
                const target = document.getElementById('menu-showcase-section');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="absolute z-20 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#1C1C1C] hover:bg-[#C64A19] text-white font-bebas text-lg tracking-[0.2em] flex flex-col items-center justify-center uppercase shadow-[0_15px_40px_rgba(0,0,0,0.30)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out border-4 border-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C64A19]/50"
            >
              EXPLORE
            </button>
          </div>

        </div>
      </section>

      {/* ALL FLAVORS / FULL ARTISANAL MENU SECTION */}
      <section
        id="all-flavors-section"
        className="relative w-full py-24 sm:py-32 bg-[#FAF6F2] text-stone-900 border-t border-b border-stone-150/50 overflow-hidden"
      >
        {/* Floating background decorative details */}
        <div className="absolute inset-0 pointer-events-none z-0 select-none">
          <div className="absolute top-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-amber-400/5 blur-[90px]" />
          <div className="absolute bottom-[10%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-orange-500/5 blur-[90px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Elegant header */}
          <div className="scroll-flavors-header text-center mb-16 sm:mb-20 flex flex-col items-center">
            <span className="font-sans text-xs sm:text-sm tracking-[0.25em] font-black text-[#C64A19] uppercase mb-3 leading-none">
              OUR COMPLETE MENU
            </span>
            <h2 className="font-bebas text-4xl sm:text-6xl tracking-tight leading-none text-stone-900 uppercase">
              ARTISANAL PIZZA FLAVORS
            </h2>
            <div className="w-16 h-[2px] bg-[#C64A19] mt-6 rounded" />
          </div>

          {/* Grid layout containing 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {PIZZAS.map((pizza) => (
              <div
                key={pizza.id}
                className="scroll-flavors-card p-6 pb-8 pt-20 transition-all duration-500 hover:-translate-y-3 flex flex-col relative group overflow-visible"
              >
                {/* 1. OVERLAPPING FLOATING PIZZA IMAGE */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 lg:w-36 lg:h-36 z-20">
                  {/* Cast shadow */}
                  <div className="absolute inset-1.5 bg-black/16 blur-md rounded-full -bottom-1.5 group-hover:bg-amber-900/20 group-hover:blur-lg transition-all duration-500" />
                  
                  {/* Main image */}
                  <img
                    src={pizza.imageUrl}
                    alt={pizza.displayName}
                    className="w-full h-full object-cover rounded-full select-none pointer-events-none transition-all duration-700 ease-out group-hover:scale-108 group-hover:rotate-[20deg] shadow-[0_10px_20px_rgba(0,0,0,0.16)] ring-4 ring-white relative z-10"
                    style={{ clipPath: 'circle(50% at 50% 50%)' }}
                  />
                </div>

                {/* 2. BRANDING BADGE & DISPLAY NAME */}
                <div className="text-center mt-6 mb-4 flex flex-col items-center">
                  <span
                    className="font-sans text-[9px] tracking-[0.2em] font-black uppercase px-2.5 py-1 rounded-full mb-3 shadow-[0_3px_8px_rgba(0,0,0,0.02)] text-white"
                    style={{ backgroundColor: pizza.accentColor }}
                  >
                    {pizza.name}
                  </span>
                  <h3 className="font-serif italic text-2xl text-stone-900 tracking-tight leading-tight group-hover:text-[#C64A19] transition-colors duration-300">
                    {pizza.displayName}
                  </h3>
                  <span className="font-sans text-[9px] font-bold tracking-widest uppercase text-stone-400 mt-1.5">
                    {pizza.tagline}
                  </span>
                </div>

                {/* 3. INGREDIENTS LIST WITH MINI REAL PHOTOS */}
                <div className="mb-6 flex flex-col items-center">
                  <span className="font-sans text-[8px] font-black tracking-widest text-stone-400 uppercase mb-2">
                    INGREDIENTS ON PIZZA
                  </span>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {pizza.ingredients.map((ing) => {
                      const assetName = ing === 'parsley' ? 'parsley-leaf' : ing;
                      return (
                        <div
                          key={ing}
                          className="group/ing relative flex items-center justify-center w-8 h-8 rounded-full border border-neutral-250/30 bg-white shadow-sm hover:scale-115 transition-transform duration-300"
                        >
                          <img
                            src={`/ingredients/${assetName}.png`}
                            alt={ing}
                            className="w-6 h-6 object-contain pointer-events-none select-none"
                          />
                          {/* Hover tooltip */}
                          <span className="absolute bottom-[108%] bg-[#380902] text-white font-sans font-bold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded shadow-md opacity-0 pointer-events-none group-hover/ing:opacity-100 transition-opacity duration-300 whitespace-nowrap z-30">
                            {ing}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. DESCRIPTION */}
                <p className="text-xs text-stone-500 leading-relaxed text-center mb-6 line-clamp-3">
                  {pizza.description}
                </p>

                {/* 5. SPECIFICATION INFO (Rating, prep, calories) */}
                <div className="grid grid-cols-3 gap-2 border-t border-b border-stone-200/50 py-3.5 mb-6 text-center select-none">
                  <div>
                    <span className="block text-[8px] text-stone-400 font-extrabold uppercase tracking-wider mb-0.5">Rating</span>
                    <span className="text-stone-800 font-black text-xs flex items-center justify-center gap-0.5">
                      {pizza.rating} <span className="text-[#FFC724] fill-[#FFC724]">★</span>
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-stone-400 font-extrabold uppercase tracking-wider mb-0.5">Prep</span>
                    <span className="text-stone-800 font-black text-xs">{pizza.prepTime}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-stone-400 font-extrabold uppercase tracking-wider mb-0.5">Energy</span>
                    <span className="text-stone-800 font-black text-xs">{pizza.calories} kcal</span>
                  </div>
                </div>

                {/* 6. PRICE & ACTION BUTTON */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="text-left">
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-stone-400 leading-none mb-0.5">PRICE</span>
                    <span className="text-stone-900 font-black text-lg tracking-tight">
                      ${pizza.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCartCount(prev => prev + 1);
                      setIsAddingToCart(true);
                      setTimeout(() => setIsAddingToCart(false), 800);
                    }}
                    className="px-5 py-2.5 bg-[#B2492D] text-white hover:bg-stone-900 rounded-full font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 relative overflow-hidden flex items-center justify-center cursor-pointer shadow-md shadow-orange-700/10 hover:-translate-y-0.5 focus:outline-none"
                    style={{
                      boxShadow: `0 8px 20px rgba(178, 73, 45, 0.15)`,
                    }}
                  >
                    Add to Cart
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION (SATISFIED CUSTOMERS) - BEAUTIFUL DARK CONTEXT */}
      <section
        id="testimonials-section"
        className="relative w-full py-24 sm:py-32 bg-[#380902] text-white z-30 overflow-hidden border-t border-white/5"
      >
        {/* DESIGN LINES, EXTRA FORMS & MOVING METEOR ELEMENTS */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Dense Premium Dotted Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.14]" 
            style={{ 
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 1.2px, transparent 1.2px)', 
              backgroundSize: '24px 24px' 
            }} 
          />

          {/* Golden and Red Ambient Glows */}
          <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#FFBC00]/12 to-transparent blur-[110px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#C64A19]/15 to-transparent blur-[110px]" />

          {/* Moving Ambient Dots for dark luxury depth */}
          <div className="signature-floating-dot absolute w-3.5 h-3.5 rounded-full bg-amber-400 blur-[0.5px] shadow-[0_0_12px_#F5C542]" style={{ left: '14%', top: '18%' }} />
          <div className="signature-floating-dot absolute w-3 h-3 rounded-full bg-orange-500 blur-[0.5px] shadow-[0_0_10px_#FF5A36]" style={{ left: '23%', top: '82%' }} />
          <div className="signature-floating-dot absolute w-4.5 h-4.5 rounded-full bg-emerald-400 blur-[1px] shadow-[0_0_14px_#34D399]" style={{ left: '84%', top: '75%' }} />
          <div className="signature-floating-dot absolute w-3 h-3 rounded-full bg-red-400 blur-[0.5px] shadow-[0_0_12px_#EF4444]" style={{ left: '76%', top: '22%' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6 md:gap-4 lg:gap-8 xl:gap-12">
            
            {/* 1. LEFT COLUMN: Headings and custom arrow navigations (matching image layout) */}
            <div className="scroll-test-left w-full md:w-[24%] lg:w-[22%] flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-sans text-xs sm:text-sm tracking-[0.2em] font-black text-[#D44422] uppercase mb-3 sm:mb-4 leading-none inline-block">
                {TESTIMONIALS[activeTestimonialIdx].tag}
              </span>
              <h2 className="font-bebas text-4xl sm:text-5xl md:text-[40px] lg:text-[54px] xl:text-[68px] tracking-tight leading-[0.9] text-white uppercase mb-6 md:mb-8">
                SATISFIED<br />CUSTOMERS
              </h2>
              
              {/* STATEFUL CAROUSEL CIRCULAR NAVIGATION ARROWS */}
              <div className="flex items-center gap-4 mt-1">
                <button
                  onClick={() => {
                    setActiveTestimonialIdx(prev => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-amber-100 text-[#380902] flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg active:scale-95 focus:outline-none"
                  aria-label="Previous Review"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setActiveTestimonialIdx(prev => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-amber-100 text-[#380902] flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg active:scale-95 focus:outline-none"
                  aria-label="Next Review"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 2. MIDDLE COLUMN: Floating photographic Polaroid picture frames stacks with generous space */}
            <div className="scroll-test-center w-full md:w-[34%] lg:w-[36%] flex items-center justify-center relative min-h-[300px] sm:min-h-[340px] md:min-h-[340px] lg:min-h-[380px] xl:min-h-[420px] overflow-visible select-none py-6">
              
              {/* Back Card (Index: active + 2) */}
              <div 
                className="absolute w-36 h-46 sm:w-40 sm:h-52 md:w-40 md:h-48 lg:w-48 lg:h-60 xl:w-56 xl:h-72 bg-[#FAF8F5] p-2 sm:p-3 pb-8 sm:pb-10 border border-white/5 shadow-xl rounded-sm transition-all duration-700 ease-out pointer-events-none"
                style={{
                  zIndex: 10,
                  transform: `scale(0.9) rotate(-8deg) translate(-28px, -15px)`,
                  opacity: 0.45,
                }}
              >
                <div className="w-full h-[80%] overflow-hidden bg-stone-900">
                  <img
                    src={TESTIMONIALS[(activeTestimonialIdx + 2) % TESTIMONIALS.length].photoUrl}
                    alt="Back testimonial photo"
                    className="w-full h-full object-cover grayscale opacity-90 blur-[0.2px]"
                  />
                </div>
                <div className="w-full h-[20%] flex items-center justify-center mt-1">
                  <span className="font-handwriting text-[#380902]/60 text-xl tracking-wide">
                    {TESTIMONIALS[(activeTestimonialIdx + 2) % TESTIMONIALS.length].badge}
                  </span>
                </div>
              </div>

              {/* Middle Card (Index: active + 1) */}
              <div 
                className="absolute w-36 h-46 sm:w-40 sm:h-52 md:w-40 md:h-48 lg:w-48 lg:h-60 xl:w-56 xl:h-72 bg-[#FCFAF7] p-2 sm:p-3 pb-8 sm:pb-10 border border-white/5 shadow-2xl rounded-sm transition-all duration-700 ease-out pointer-events-none"
                style={{
                  zIndex: 15,
                  transform: `scale(0.95) rotate(6deg) translate(22px, -8px)`,
                  opacity: 0.75,
                }}
              >
                <div className="w-full h-[80%] overflow-hidden bg-stone-900">
                  <img
                    src={TESTIMONIALS[(activeTestimonialIdx + 1) % TESTIMONIALS.length].photoUrl}
                    alt="Middle testimonial photo"
                    className="w-full h-full object-cover grayscale-[40%] opacity-95"
                  />
                </div>
                <div className="w-full h-[20%] flex items-center justify-center mt-1">
                  <span className="font-handwriting text-[#380902]/85 text-2xl tracking-wide">
                    {TESTIMONIALS[(activeTestimonialIdx + 1) % TESTIMONIALS.length].badge}
                  </span>
                </div>
              </div>

              {/* Main Front Card (Active Index) */}
              <div 
                className="absolute w-36 h-46 sm:w-40 sm:h-52 md:w-40 md:h-48 lg:w-48 lg:h-60 xl:w-56 xl:h-72 bg-white p-2 sm:p-3 pb-8 sm:pb-10 border border-white/10 shadow-[0_25px_55px_rgba(0,0,0,0.65)] rounded-sm transition-all duration-700 ease-out group cursor-pointer"
                style={{
                  zIndex: 20,
                  transform: `scale(1) rotate(-3deg)`,
                  opacity: 1,
                }}
              >
                {/* Image Inside Polaroid */}
                <div className="w-full h-[80%] overflow-hidden bg-stone-200 relative">
                  <div className="absolute inset-0 bg-stone-950/5 group-hover:bg-transparent transition-colors duration-300" />
                  <img
                    src={TESTIMONIALS[activeTestimonialIdx].photoUrl}
                    alt={TESTIMONIALS[activeTestimonialIdx].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                  />
                </div>

                {/* Polaroid caption with custom handwriting font */}
                <div className="w-full h-[20%] flex items-center justify-center relative mt-1 sm:mt-1.5 overflow-visible">
                  <span className="font-handwriting text-[#380902] text-2xl sm:text-3xl tracking-wide absolute -bottom-1">
                    {TESTIMONIALS[activeTestimonialIdx].badge}
                  </span>
                </div>
              </div>

            </div>

            {/* 3. PARTITION: Vertical name line and rotated text exactly as in image */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4 h-36 lg:h-48 select-none px-1 scale-75 lg:scale-95">
              <div className="w-[1px] h-24 lg:h-32 bg-white/10" />
              <span className="font-bebas text-[#E0522E] text-base lg:text-xl tracking-[0.25em] [writing-mode:vertical-rl] select-none uppercase font-black whitespace-nowrap leading-none transform rotate-180">
                {TESTIMONIALS[activeTestimonialIdx].name}
              </span>
              <div className="w-[1px] h-24 lg:h-32 bg-white/10" />
            </div>

            {/* Responsive Name Tag for mobile view sizes (only hidden on md and up) */}
            <div className="flex md:hidden flex-col items-center gap-2 -mt-4 mb-4">
              <span className="font-bebas text-[#E0522E] text-lg tracking-[0.25em] uppercase font-bold">
                {TESTIMONIALS[activeTestimonialIdx].name}
              </span>
              <div className="w-24 h-[1px] bg-white/10" />
            </div>

            {/* 4. RIGHT COLUMN: Testimonial review quote markup text with Highlight Underlines */}
            <div className="scroll-test-right w-full md:w-[26%] lg:w-[24%] flex flex-col items-center md:items-start text-center md:text-left md:pl-4">
              
              {/* Highlight styled quote markup format */}
              <p
                className="font-sans text-stone-200 text-sm sm:text-base md:text-xs lg:text-[14px] xl:text-[16px] font-normal leading-relaxed mb-6 md:mb-8 w-full max-w-[280px] sm:max-w-xs md:max-w-[240px] lg:max-w-[280px] xl:max-w-sm min-h-[150px] sm:min-h-[130px] md:min-h-[140px] lg:min-h-[120px] text-center md:text-left"
                dangerouslySetInnerHTML={{ __html: TESTIMONIALS[activeTestimonialIdx].quoteHtml }}
              />

              {/* Rating pill with solid rust background */}
              <div className="inline-flex items-center gap-1.5 bg-[#B2492D] px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-[0_5px_15px_rgba(178,73,45,0.4)] select-none">
                {Array.from({ length: TESTIMONIALS[activeTestimonialIdx].rating }).map((_, i) => (
                  <svg key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

            </div>

          </div>

          {/* BOTTOM BACKDROP: Giant SATISFIED text overlay */}
          <div className="relative mt-20 sm:mt-24 h-24 sm:h-32 flex items-center justify-center select-none pointer-events-none overflow-visible">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bebas text-[14vw] sm:text-[16vw] leading-none tracking-[0.2em] text-white/[0.03] uppercase">
                SATISFIED
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US & WE ARE KNOWN SECTION - BEAUTIFUL CLEAN MINIMAL GRID */}
      <section
        id="why-choose-us"
        className="relative w-full py-24 sm:py-32 bg-white text-stone-900 border-t border-stone-100"
      >
        <div className="max-w-7xl mx-auto px-6 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: The Feature Grid */}
            <div className="lg:col-span-8 flex flex-col">
              
              {/* Elegant Section Header */}
              <div className="scroll-why-header flex items-center gap-6 md:gap-8 mb-12 select-none">
                <span className="font-sans text-xs sm:text-sm tracking-[0.25em] font-black text-[#C64A19] uppercase shrink-0 leading-none">
                  WHY CHOOSE US?
                </span>
                <div className="w-[1px] h-10 bg-neutral-200 shrink-0" />
                <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none text-stone-900 uppercase">
                  WE ARE KNOWN
                </h2>
              </div>

              {/* 3x2 Grid Container with detailed dividers */}
              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-b border-neutral-150 md:divide-x divide-neutral-150 divide-y md:divide-y-0">
                
                {/* Column 1 */}
                <div className="flex flex-col divide-y divide-neutral-150">
                  {/* Item 1 */}
                  <div className="scroll-why-item flex items-start gap-6 py-10 px-4 sm:px-8 group hover:bg-neutral-50/50 transition-colors duration-305">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-stone-50 text-[#8E1F0D] group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M12 21c-4.418 0-8-3.134-8-7s3.582-7 8-7 8 3.134 8 7-3.582 7-8 7z" />
                        <path d="M12 7c.5-1.5 2-2.5 3-2M12 7c-.5-1.5-2-2.5-3-2M12 7V4M12 4c.5-1 2-1 2-1M12 4c-.5-1-2-1-2-1" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bebas text-2xl tracking-wide text-stone-900 leading-tight uppercase">ALWAYS SERVE FRESH FOOD</h3>
                      <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">Perfectly portioned ingredients.</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="scroll-why-item flex items-start gap-6 py-10 px-4 sm:px-8 group hover:bg-neutral-50/50 transition-colors duration-305">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-stone-50 text-[#8E1F0D] group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M6 18c0-1.5 1-3.5 3-4C7 11.5 7.5 7 12 7c4.5 0 5 4.5 3 7 2 .5 3 2.5 3 4M5 18h14M6 21h12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bebas text-2xl tracking-wide text-stone-900 leading-tight uppercase">WE HAVE POPULAR MASTERCHEF</h3>
                      <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">The patient staff reflects the style.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="scroll-why-item flex items-start gap-6 py-10 px-4 sm:px-8 group hover:bg-neutral-50/50 transition-colors duration-305">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-stone-50 text-[#8E1F0D] group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M20.5 4.5C20.5 4.5 12 6 8 10c-4 4-4.5 11.5-4.5 11.5s7.5-.5 11.5-4.5c4-4 5.5-12.5 5.5-12.5z" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="11" cy="11" r="1.5" fill="currentColor" />
                        <circle cx="15" cy="8" r="1" fill="currentColor" />
                        <circle cx="8" cy="15" r="1.5" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bebas text-2xl tracking-wide text-stone-900 leading-tight uppercase">DELICIOUS PIZZA RECIPES</h3>
                      <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">Best crust with this good recipe.</p>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col divide-y divide-neutral-150">
                  {/* Item 4 */}
                  <div className="scroll-why-item flex items-start gap-6 py-10 px-4 sm:px-8 group hover:bg-neutral-50/50 transition-colors duration-305">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-stone-50 text-[#8E1F0D] group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bebas text-2xl tracking-wide text-stone-900 leading-tight uppercase">MAINTAINING THE QUALITY OF FOOD</h3>
                      <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">Standardized food recipes for uniform taste.</p>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="scroll-why-item flex items-start gap-6 py-10 px-4 sm:px-8 group hover:bg-neutral-50/50 transition-colors duration-305">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-stone-50 text-[#8E1F0D] group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M9 18V5l12-2v13M9 10l12-2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bebas text-2xl tracking-wide text-stone-900 leading-tight uppercase">BEST LIVE MUSIC RESTAURANTS</h3>
                      <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">Beautiful natural & serene ambience.</p>
                    </div>
                  </div>

                  {/* Item 6 */}
                  <div className="scroll-why-item flex items-start gap-6 py-10 px-4 sm:px-8 group hover:bg-neutral-50/50 transition-colors duration-305">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-stone-50 text-[#8E1F0D] group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M21 16c0-4.418-4.03-8-9-8s-9 3.582-9 8h18zM12 4M12 4v4M10 4h4" strokeLinecap="round" />
                        <path d="M2 19h20c0 1.105-.895 2-2 2H4c-1.105 0-2-.895-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bebas text-2xl tracking-wide text-stone-900 leading-tight uppercase">WONDERFUL DINING EXPERIENCE</h3>
                      <p className="font-sans text-sm text-stone-500 mt-1 leading-relaxed">A memorable dining atmosphere.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Fresh ripe tomato visual side element with Scroll Bar as in image */}
            <div className="lg:col-span-4 flex flex-row items-stretch justify-center relative min-h-[400px] select-none pl-4 overflow-visible">
              
              <div className="flex-1 flex flex-col items-center justify-center py-8 relative">
                {/* Ripe tomato transparent image illustration float effect */}
                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [0, 4, -2, 0] }}
                  transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                  className="scroll-why-tomato relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center"
                >
                  <img
                    src={PARLOR_TOMATO_IMAGE}
                    alt="Glossy Italian Tomato"
                    className="w-full h-full object-contain filter drop-shadow-[0_25px_45px_rgba(142,31,13,0.35)]"
                  />
                  {/* Absolute small helper labels around card */}
                  <span className="absolute top-1/2 -left-6 tracking-[0.2em] text-[10px] font-mono text-stone-400 transform -rotate-90 uppercase">
                    100% Organic
                  </span>
                  <span className="absolute bottom-6 right-6 tracking-[0.2em] text-[10px] font-mono text-stone-400 uppercase">
                    Handmade
                  </span>
                </motion.div>
              </div>

              {/* Vertical line with vertical "SCROLL" and branding tag just like the image 2 right columns */}
              <div className="w-16 flex flex-col items-center justify-between border-l border-neutral-100 py-6 scale-95 shrink-0 select-none">
                <span className="font-sans text-[10px] font-black tracking-[0.3em] uppercase text-stone-400 rotate-90 my-12 whitespace-nowrap">
                  SCROLL DOWN
                </span>
                <div className="w-[1.5px] h-24 bg-neutral-200" />
                <div className="bg-[#380902] text-white py-4 px-2 tracking-[0.2em] font-sans font-black text-[9px] uppercase [writing-mode:vertical-rl] rounded-sm transform rotate-180 shadow-md">
                  PIZZA CRAVE ORIGINALS
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* TWO PROMOTIONAL CARDS - MOST POPULAR PIZZA & FASTEST COURIER ASSETS */}
      <section className="relative w-full py-16 px-6 bg-[#FAF6F2] z-30 overflow-visible border-b border-neutral-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 overflow-visible">
          
          {/* BANNER A: SPECIAL DELICIOUS */}
          <div className="relative bg-[#FAF8F5] border border-neutral-150/60 rounded-lg p-8 sm:p-12 flex flex-col justify-between overflow-hidden min-h-[300px] group shadow-sm hover:shadow-md transition-all duration-300">
            
            {/* Hanging pizza cut-out image on the top right */}
            <div className="absolute right-[-45px] top-[-35px] w-64 h-64 sm:w-72 sm:h-72 select-none pointer-events-none transform group-hover:rotate-12 transition-transform duration-700 z-10">
              <img
                src="/pizza-main.png"
                alt="Pizza Crave Sourdough Masterpiece"
                className="w-full h-full object-cover rounded-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.22)]"
                style={{ clipPath: 'circle(50% at 50% 50%)' }}
              />
            </div>

            {/* Banner details */}
            <div className="relative z-20 flex flex-col items-start max-w-[55%]">
              <span className="font-sans text-[#E0522E] text-xs tracking-widest font-black uppercase mb-3">
                MOST POPULAR
              </span>
              <h3 className="font-bebas text-4xl sm:text-5xl text-stone-900 leading-[0.9] uppercase tracking-tight mb-8">
                SPECIAL<br />DELICIOUS
              </h3>
              <button 
                onClick={() => {
                  const el = document.getElementById('artisanal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-[#380902] hover:text-white text-stone-900 border border-neutral-200/60 font-sans text-xs font-black tracking-widest px-8 py-3.5 rounded-full shadow-sm transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                ORDER NOW
              </button>
            </div>

            {/* Rotated gold/amber badge circle tag of "FREE DRINKS" */}
            <div className="absolute left-[45%] bottom-10 bg-[#FFBC00] text-[#380902] w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center font-bebas text-center leading-none tracking-wide text-lg font-bold shadow-lg transform -rotate-12 select-none animate-bounce z-25">
              <span className="text-[9px] tracking-[0.1em] font-sans font-black">FREE</span>
              <span className="text-xl shrink-0 uppercase font-black">DRINKS</span>
            </div>

          </div>

          {/* BANNER B: FASTEST DELIVERY */}
          <div className="relative bg-[#FAF8F5] border border-neutral-150/60 rounded-lg p-8 sm:p-12 flex flex-col justify-between overflow-hidden min-h-[300px] group shadow-sm hover:shadow-md transition-all duration-300">
            
            {/* Courier SVG artwork aligned to the right (identical layout to illustration in image 2) */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-64 sm:w-72 h-44 select-none pointer-events-none z-10 opacity-95 group-hover:scale-105 transition-transform duration-500">
              <svg className="w-full h-full text-stone-800" viewBox="0 0 540 380" fill="none">
                <circle cx="160" cy="280" r="35" stroke="currentColor" strokeWidth="12" fill="#FAF5F0" />
                <circle cx="160" cy="280" r="16" fill="currentColor" />
                <circle cx="380" cy="280" r="35" stroke="currentColor" strokeWidth="12" fill="#FAF5F0" />
                <circle cx="380" cy="280" r="16" fill="currentColor" />
                <path d="M160 280h110l50-80h60l-10-80" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M250 200l20 80h110" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M120 270a45 45 0 0 1 80 0" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M340 270a45 45 0 0 1 80 0" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M230 180c-25 0-45 20-45 45s20 45 45 45h60l10-90H230z" fill="#FFBC00" stroke="currentColor" strokeWidth="10" strokeLinejoin="round" />
                <path d="M300 240l20 40h50l-15-40H300z" fill="#FFBC00" stroke="currentColor" strokeWidth="10" strokeLinejoin="round" />
                <path d="M380 200l-30-100h20" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
                <circle cx="375" cy="115" r="15" fill="#FFBC00" stroke="currentColor" strokeWidth="8" />
                <rect x="100" y="110" width="90" height="90" rx="8" fill="#EDEDED" stroke="currentColor" strokeWidth="10" />
                <path d="M120 165h50M145 140a18 18 0 0 1 18 18h-36a18 18 0 0 1 18-18z" stroke="currentColor" strokeWidth="6" fill="none" />
                <path d="M230 150l20-70 50 10 30 80h-40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M250 90l60 20 40 10" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="235" cy="45" r="18" fill="currentColor" />
                <path d="M230 30h25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>

            {/* Banner details */}
            <div className="relative z-20 flex flex-col items-start max-w-[55%]">
              <span className="font-sans text-[#E0522E] text-xs tracking-widest font-black uppercase mb-3">
                ORDER $50
              </span>
              <h3 className="font-bebas text-4xl sm:text-5xl text-stone-900 leading-[0.9] uppercase tracking-tight mb-8">
                FASTEST<br />DELIVERY
              </h3>
              <button 
                onClick={() => {
                  const el = document.getElementById('artisanal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-[#380902] hover:text-white text-stone-900 border border-neutral-200/60 font-sans text-xs font-black tracking-widest px-8 py-3.5 rounded-full shadow-sm transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                ORDER NOW
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER SECTION: LUXURY DARK MAROON CONTEXT WITH DRIVER ROAD TRACK */}
      <footer className="relative bg-[#380902] text-white z-40 overflow-visible select-none text-center sm:text-left">
        
        {/* Curved boundary for luxury wave look */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none select-none -translate-y-[99%]">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[8vh] min-h-[50px]"
            preserveAspectRatio="none"
          >
            <path d="M 0 120 C 480 0, 960 0, 1440 120 L 1440 120 L 0 120 Z" fill="#380902" />
          </svg>
        </div>

        {/* ACTIVE COURIER DELIVERY ROADWAY STRIP */}
        <div className="relative w-full bg-[#200501] border-b border-white/5 py-3 h-14 overflow-hidden flex items-center">
          {/* Custom Yellow Dashed Road Divider Lane */}
          <div className="absolute left-0 right-0 h-[2px] border-t-2 border-dashed border-amber-400/35" />
          
          {/* Framer-Motion driven delivery courier moving from left to right */}
          <motion.div
            initial={{ x: "-150px" }}
            animate={{ x: "100vw" }}
            transition={{
              duration: 22,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute flex items-center gap-3 z-10 pointer-events-none overflow-visible"
          >
            {/* Courier Scooter Rider SVG Illustration */}
            <svg className="w-14 h-11 text-[#FFBC00] filter drop-shadow-[0_2px_8px_rgba(255,188,0,0.4)]" viewBox="0 0 100 80" fill="none">
              <path d="M10 50h20l10-15h15l-2 15h10M40 35l15 15h20" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="55" r="10" stroke="currentColor" strokeWidth="4.5" fill="#200501" />
              <circle cx="70" cy="55" r="10" stroke="currentColor" strokeWidth="4.5" fill="#200501" />
              {/* Head / Helmet */}
              <circle cx="48" cy="20" r="6" fill="#FFF" stroke="currentColor" strokeWidth="3" />
              <path d="M48 26l6 14M54 40h12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M48 26l12 6h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              {/* Orange Cargo box */}
              <rect x="5" y="25" width="18" height="18" rx="2" fill="#E0522E" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-sans font-black tracking-widest text-[#FFBC00] uppercase leading-none">Pizza Crave</span>
              <span className="text-[7px] font-mono text-zinc-400 uppercase leading-none mt-0.5">Rapid Delivery Road...</span>
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
          
          {/* HOME DELIVERY EXPERIENCE BANNER TITLE (Matching Image 2 banner) */}
          <div className="text-center pb-10 mb-10">
            <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-[66px] tracking-tight text-white uppercase leading-none flex flex-col sm:flex-row items-center justify-center gap-3">
              <span>UNFORGETTABLE HOME DELIVERY EXPERIENCE</span>{" "}
              <span className="inline-flex items-center gap-4 whitespace-nowrap">
                <a href="tel:+12345678910" className="underline decoration-[#FFBC00] decoration-3 underline-offset-8 hover:text-[#FFBC00] transition-colors relative group pl-5">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#FFBC00] rounded-full animate-ping" />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#FFBC00] rounded-full" />
                  +1 234 567 8910
                </a>
              </span>
            </h2>
          </div>

          {/* NEWSLETTER SUBSCRIBE GRID BANNER */}
          <div className="relative z-10 w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[28px] p-8 sm:p-10 mb-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-md text-left">
              <span className="font-sans text-[10px] tracking-[0.2em] font-black text-[#FFBC00] uppercase mb-2 block">CRAVE LAB CLUB</span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide uppercase leading-none mb-2">Subscribe to our Secret Recipes</h3>
              <p className="font-sans text-xs text-stone-400">Join our newsletter to receive exclusive recipes, culinary updates, and special tasting invitations.</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center w-full md:max-w-md bg-white/5 rounded-full p-1.5 border border-white/15 focus-within:border-[#FFBC00]/60 focus-within:ring-1 focus-within:ring-[#FFBC00]/30 transition-all duration-300">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 bg-transparent border-0 outline-none px-4 py-2 text-sm text-white placeholder-stone-500 font-sans"
                required
              />
              <button
                type="submit"
                className="bg-[#FFBC00] hover:bg-white text-[#380902] font-sans font-black text-xs tracking-widest uppercase px-6 py-3 rounded-full transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-1"
              >
                Join Now <span className="font-mono">→</span>
              </button>
            </form>
          </div>

          {/* MAIN FOOTER CONTENTS COLUMNS: 5 COLUMN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 sm:gap-8 items-start mb-16 text-center sm:text-left text-stone-300">
            
            {/* Column 1: Custom logo with rotating cutlery icon */}
            <div className="flex flex-col items-center sm:items-start text-left col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4 self-center sm:self-start">
                <div className="bg-white text-[#380902] p-2.5 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bebas text-2xl tracking-[0.1em] text-white leading-none uppercase">PIZZA CRAVE</span>
                  <span className="font-sans font-medium text-[9px] tracking-widest text-amber-300 uppercase mt-0.5">Gourmet Neapolitan</span>
                </div>
              </div>
              <p className="font-sans text-xs leading-relaxed max-w-xs text-center sm:text-left">
                Award-winning slow sourdough bakery and Neapolitan kitchen. Experience gastronomy where science matches pure Italian soul since 1984.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-bebas text-xl tracking-wider text-white uppercase mb-4 font-bold">Quick Links</h4>
              <ul className="font-sans text-xs space-y-2.5 text-stone-400">
                <li>
                  <a href="#hero-section" className="hover:text-amber-300 transition-colors uppercase tracking-wider font-semibold">Masterpiece</a>
                </li>
                <li>
                  <a href="#signature-pizza-section" className="hover:text-amber-300 transition-colors uppercase tracking-wider font-semibold">Popular Pizzas</a>
                </li>
                <li>
                  <a href="#all-flavors-section" className="hover:text-amber-300 transition-colors uppercase tracking-wider font-semibold">All Flavors</a>
                </li>
                <li>
                  <a href="#why-choose-us" className="hover:text-amber-300 transition-colors uppercase tracking-wider font-semibold">Why Choose Us</a>
                </li>
                <li>
                  <a href="#testimonials-section" className="hover:text-amber-300 transition-colors uppercase tracking-wider font-semibold">Customer Reviews</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Find our restaurants address */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-bebas text-xl tracking-wider text-white uppercase mb-4 font-bold">Find our restaurants</h4>
              <p className="font-sans text-xs leading-relaxed max-w-xs">
                401 Broadway, 24th Floor
                <br />
                New York, NY 10013
                <br />
                <span className="font-semibold text-amber-300 mt-2 block">tel. +1 234 567 8910</span>
              </p>
            </div>

            {/* Column 4: Opening hours */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-bebas text-xl tracking-wider text-white uppercase mb-4 font-bold">Opening hours</h4>
              <p className="font-sans text-xs leading-relaxed max-w-xs">
                Monday – Sunday
                <br />
                9:00 AM to 11:30 PM
                <br />
                <span className="text-[#FFBC00] font-semibold block mt-2">Open Regular Hours On Holidays</span>
              </p>
            </div>

            {/* Column 5: Content integrations connect buttons */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-bebas text-xl tracking-wider text-white uppercase mb-4 font-bold">Connect with us</h4>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#social-fb"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#FFBC00] text-white hover:text-[#380902] border border-white/10 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 hover:shadow-[0_0_15px_rgba(255,188,0,0.5)] active:scale-95"
                  aria-label="Facebook Link"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>
                <a
                  href="#social-ig"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#FFBC00] text-white hover:text-[#380902] border border-white/10 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 hover:shadow-[0_0_15px_rgba(255,188,0,0.5)] active:scale-95"
                  aria-label="Instagram Link"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
                <a
                  href="#social-x"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#FFBC00] text-white hover:text-[#380902] border border-white/10 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 hover:shadow-[0_0_15px_rgba(255,188,0,0.5)] active:scale-95"
                  aria-label="Twitter Link"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
 
          </div>
 
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8 text-stone-400 font-sans text-[11px] uppercase tracking-wider">
            <span>Award-Winning Food Design Lab © 2026</span>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-amber-300 transition-colors">Privacy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-amber-300 transition-colors">Terms of Taste</a>
              <span>•</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition-colors cursor-pointer text-amber-300 font-black"
              >
                Torna Su ↑
              </button>
            </div>
          </div>
 
        </div>
      </footer>
    </div>
  );
}
