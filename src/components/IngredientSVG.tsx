import React from 'react';

interface IngredientSVGProps {
  type: 'basil' | 'tomato' | 'olive' | 'jalapeno' | 'mushroom' | 'onion';
  className?: string;
  style?: React.CSSProperties;
}

export const IngredientSVG: React.FC<IngredientSVGProps> = ({ type, className = '', style }) => {
  switch (type) {
    case 'basil':
      return (
        <svg
          viewBox="0 0 120 120"
          className={className}
          style={style}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="basilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="40%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </linearGradient>
            <linearGradient id="basilVein" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Main Leaf */}
          <path
            d="M 10 90 C 20 40, 60 10, 110 10 C 100 60, 70 100, 10 90 Z"
            fill="url(#basilGrad)"
          />
          {/* Main Vein */}
          <path
            d="M 10 90 C 40 60, 70 35, 110 10"
            stroke="url(#basilVein)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Secondary Veins left */}
          <path d="M 40 60 C 35 50, 30 46, 25 45" stroke="url(#basilVein)" strokeWidth="1.5" fill="none" />
          <path d="M 60 45 C 55 35, 48 30, 40 28" stroke="url(#basilVein)" strokeWidth="1.5" fill="none" />
          <path d="M 80 30 C 75 22, 68 18, 60 16" stroke="url(#basilVein)" strokeWidth="1.2" fill="none" />
          {/* Secondary Veins right */}
          <path d="M 40 60 C 50 68, 55 72, 60 75" stroke="url(#basilVein)" strokeWidth="1.5" fill="none" />
          <path d="M 60 45 C 70 52, 78 58, 85 60" stroke="url(#basilVein)" strokeWidth="1.5" fill="none" />
          <path d="M 80 30 C 90 35, 96 38, 100 40" stroke="url(#basilVein)" strokeWidth="1.2" fill="none" />
        </svg>
      );

    case 'tomato':
      return (
        <svg
          viewBox="0 0 120 120"
          className={className}
          style={style}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="tomatoOuter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="85%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </radialGradient>
            <radialGradient id="tomatoInner" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="70%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </radialGradient>
            <linearGradient id="seedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          {/* Red Skin Border */}
          <circle cx="60" cy="60" r="54" fill="url(#tomatoOuter)" />
          {/* Fleshy Inner core */}
          <circle cx="60" cy="60" r="46" fill="url(#tomatoInner)" />
          {/* Inner ring center section */}
          <circle cx="60" cy="60" r="14" fill="#F87171" opacity="0.6" />
          
          {/* Tomato seed pockets (Locules) */}
          {/* Pocket 1 */}
          <path
            d="M 50 34 C 40 34, 32 42, 34 52 C 36 62, 46 64, 52 56 C 54 48, 56 34, 50 34 Z"
            fill="#7F1D1D"
            opacity="0.85"
          />
          {/* Pocket 2 */}
          <path
            d="M 70 34 C 80 34, 88 42, 86 52 C 84 62, 74 64, 68 56 C 66 48, 64 34, 70 34 Z"
            fill="#7F1D1D"
            opacity="0.85"
          />
          {/* Pocket 3 */}
          <path
            d="M 60 86 C 48 86, 42 78, 46 68 C 50 60, 60 58, 66 68 C 72 78, 70 86, 60 86 Z"
            fill="#7F1D1D"
            opacity="0.85"
          />

          {/* Golden seeds */}
          {/* Seeds Pocket 1 */}
          <circle cx="40" cy="42" r="3" fill="url(#seedGrad)" />
          <circle cx="37" cy="48" r="3" fill="url(#seedGrad)" />
          <circle cx="44" cy="49" r="2.5" fill="url(#seedGrad)" />

          {/* Seeds Pocket 2 */}
          <circle cx="80" cy="42" r="3" fill="url(#seedGrad)" />
          <circle cx="83" cy="48" r="3" fill="url(#seedGrad)" />
          <circle cx="76" cy="49" r="2.5" fill="url(#seedGrad)" />

          {/* Seeds Pocket 3 */}
          <circle cx="53" cy="76" r="3" fill="url(#seedGrad)" />
          <circle cx="67" cy="76" r="3" fill="url(#seedGrad)" />
          <circle cx="60" cy="73" r="2.5" fill="url(#seedGrad)" />

          {/* Glistening highlights */}
          <path
            d="M 22 45 C 20 65, 30 90, 50 98"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
        </svg>
      );

    case 'olive':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={style}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="oliveBody" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="45%" stopColor="#1F2937" />
              <stop offset="90%" stopColor="#111827" />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>
            <linearGradient id="oliveRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#111827" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Main olive round sliced ring */}
          <circle cx="50" cy="50" r="40" fill="url(#oliveBody)" />
          {/* Hollow center cut-out */}
          <circle cx="50" cy="50" r="16" fill="transparent" />
          {/* Inner shade to create depth */}
          <circle
            cx="50"
            cy="50"
            r="16"
            stroke="url(#oliveRim)"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Inner boundary rim */}
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="url(#oliveRim)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Little gleam reflection */}
          <path
            d="M 24 35 A 30 30 0 0 1 45 18"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
        </svg>
      );

    case 'jalapeno':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={style}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="jalSkin" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#15803D" />
              <stop offset="90%" stopColor="#166534" />
              <stop offset="100%" stopColor="#14532D" />
            </radialGradient>
            <radialGradient id="jalFlesh" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#BBF7D0" />
              <stop offset="100%" stopColor="#86EFAC" />
            </radialGradient>
            <linearGradient id="jalSeed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          {/* Outer skin */}
          <circle cx="50" cy="50" r="44" fill="url(#jalSkin)" />
          {/* Inner flesh */}
          <circle cx="50" cy="50" r="37" fill="url(#jalFlesh)" />
          
          {/* Center hollow seed compartment with lobes */}
          <path
            d="M 50 30 C 42 30, 36 34, 38 42 C 40 50, 48 48, 44 58 C 40 68, 52 70, 58 66 C 64 62, 58 52, 64 44 C 70 36, 58 30, 50 30 Z"
            fill="#4ADE80"
            opacity="0.4"
          />

          {/* Core hollow cutout */}
          <path
            d="M 50 32 C 45 32, 40 35, 41 41 C 42 47, 49 46, 46 54 C 43 62, 51 64, 55 61 C 59 58, 55 50, 60 43 C 65 36, 55 32, 50 32 Z"
            fill="#FFF2E5" /* Blends with app background */
            opacity="1"
          />

          {/* Jalapeno Seeds */}
          {/* Seed 1 */}
          <ellipse cx="40" cy="36" rx="3.5" ry="2.5" fill="url(#jalSeed)" transform="rotate(-15 40 36)" />
          {/* Seed 2 */}
          <ellipse cx="61" cy="40" rx="3.5" ry="2.5" fill="url(#jalSeed)" transform="rotate(30 61 40)" />
          {/* Seed 3 */}
          <ellipse cx="44" cy="58" rx="3" ry="2.2" fill="url(#jalSeed)" transform="rotate(75 44 58)" />
          {/* Seed 4 */}
          <ellipse cx="54" cy="62" rx="3.5" ry="2.5" fill="url(#jalSeed)" transform="rotate(-45 54 62)" />

          {/* Glossy overlay */}
          <path
            d="M 18 36 C 14 50, 20 70, 34 80"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
        </svg>
      );

    case 'mushroom':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={style}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mushSkin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E5E7EB" />
              <stop offset="60%" stopColor="#D1D5DB" />
              <stop offset="100%" stopColor="#9CA3AF" />
            </linearGradient>
            <linearGradient id="mushGills" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#451A03" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
          {/* Cap outline */}
          <path
            d="M 15 50 C 15 20, 85 20, 85 50 C 70 54, 58 48, 50 48 C 42 48, 30 54, 15 50 Z"
            fill="url(#mushSkin)"
          />
          {/* Gills block under cap */}
          <path
            d="M 20 49 C 30 52, 42 47, 50 47 C 58 47, 70 52, 80 49 C 78 54, 68 56, 50 56 C 32 56, 22 54, 20 49 Z"
            fill="url(#mushGills)"
          />
          {/* Stem protruding down */}
          <path
            d="M 40 48 L 42 82 C 42 86, 58 86, 58 82 L 60 48 C 55 46, 45 46, 40 48 Z"
            fill="url(#mushSkin)"
          />
          {/* Gentle tan shading on mushroom face */}
          <path
            d="M 25 45 C 33 26, 67 26, 75 45 C 70 41, 62 44, 50 42 C 38 44, 30 41, 25 45 Z"
            fill="#DDB892"
            opacity="0.25"
          />
          {/* Glossy ridge/texture */}
          <path
            d="M 26 32 C 34 22, 66 22, 74 32"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
        </svg>
      );

    case 'onion':
      return (
        <svg
          viewBox="0 0 120 120"
          className={className}
          style={style}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="onionSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A21CAF" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#701A75" />
            </linearGradient>
            <linearGradient id="onionFlesh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDF4FF" />
              <stop offset="70%" stopColor="#FAE8FF" />
              <stop offset="100%" stopColor="#F5D0FE" />
            </linearGradient>
            <filter id="blurFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>
          {/* Glistening triple-ring cross section of Red Onion */}
          {/* Outer larger ring */}
          <path
            d="M 60 10 A 50 50 0 1 0 60 110 A 50 50 0 1 0 60 10 Z M 60 22 A 38 38 0 1 1 60 98 A 38 38 0 1 1 60 22 Z"
            fill="url(#onionSkin)"
          />
          {/* Outer ring inner white core */}
          <path
            d="M 60 14 A 46 46 0 1 0 60 106 A 46 46 0 1 0 60 14 Z M 60 19 A 41 41 0 1 1 60 101 A 41 41 0 1 1 60 19 Z"
            fill="url(#onionFlesh)"
            opacity="0.9"
          />

          {/* Secondary slightly displaced inner ring */}
          <g transform="translate(10, 8) rotate(15 60 60) scale(0.72)">
            <path
              d="M 60 10 A 50 50 0 1 0 60 110 A 50 50 0 1 0 60 10 Z M 60 21 A 39 39 0 1 1 60 99 A 39 39 0 1 1 60 21 Z"
              fill="url(#onionSkin)"
            />
            <path
              d="M 60 13 A 47 47 0 1 0 60 107 A 47 47 0 1 0 60 13 Z M 60 18 A 42 42 0 1 1 60 102 A 42 42 0 1 1 60 18 Z"
              fill="url(#onionFlesh)"
              opacity="0.9"
            />
          </g>

          {/* Tertiary tiny concentric ring center */}
          <g transform="translate(-8, 12) rotate(-35 60 60) scale(0.42)">
            <circle cx="60" cy="60" r="50" fill="url(#onionSkin)" />
            <circle cx="60" cy="60" r="38" fill="url(#onionFlesh)" />
            <circle cx="60" cy="60" r="16" fill="#FFF2E5" /> {/* blend with background */}
          </g>

          {/* Highlights */}
          <path
            d="M 20 40 A 42 42 0 0 1 80 20"
            stroke="#FAFAFA"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />
        </svg>
      );

    default:
      return null;
  }
};
