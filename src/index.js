import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import topoData from 'swiss-maps/2021/ch-combined.json';
import sportData from '../data/data-sport.json';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ═══════════════════════════════════════════════════════════════
   PALETTE
   ═══════════════════════════════════════════════════════════════ */
const C = {
  louis: '#3473F0',
  chloe: '#df3a97',
  thomas: '#bf4e0d',
  bruna: '#8B5CF6',
  accent: '#FF3340',
  gold: '#F5A623',
  green: '#22C55E',
  muted: '#C8C4BB',
  dark: '#0D0C11',
  inv: '#F3F0E9',
};

/* ═══════════════════════════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════════════════════════ */
function resolvePath(obj, path) {
  return path.split('.').reduce((a, k) => a?.[k], obj);
}

function injectStats() {
  document.querySelectorAll('[data-stat]').forEach(el => {
    const val = resolvePath(sportData, el.dataset.stat);
    if (val === undefined) return;
    /* Vérifier si un % suit déjà dans le DOM pour éviter le double %% */
    const nextNode = el.nextSibling;
    const hasTrailingPct = nextNode?.nodeType === 3 && nextNode.textContent.trimStart().startsWith('%');
    if (typeof val === 'number') {
      /* Si % déjà présent après le span, injecter juste le chiffre */
      el.textContent = hasTrailingPct
        ? (Number.isInteger(val) ? String(val) : val.toFixed(1))
        : (Number.isInteger(val) ? val + '%' : val.toFixed(1) + '%');
    } else {
      el.textContent = val;
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   PERSONNAGES — SVG ILLUSTRÉS
   Viewbox 0 0 110 200 — style flat illustration
   ═══════════════════════════════════════════════════════════════ */

/* Couleurs de peau et cheveux par personnage */
const CHARS = {
  louis: { skin: '#F5C4A0', hair: '#2C1A0E', accent: C.louis, dark: '#1A56CC' },
  chloe: { skin: '#F8D4B0', hair: '#1A0A05', accent: C.chloe, dark: '#8a175e' },
  thomas: { skin: '#F0BB8A', hair: '#4A3728', accent: C.thomas, dark: '#9a2d06' },
  bruna: { skin: '#C8906A', hair: '#110806', accent: C.bruna, dark: '#6D35D8' },
};

function avatarSVG(name, displaySize = 120) {
  const d = CHARS[name];
  if (!d) return '';

  let specific = '';

  if (name === 'louis') {
    specific = `
    <!-- Sneakers blanches avec détail bleu -->
    <rect x="26" y="168" width="24" height="14" rx="7" fill="#EEF2FF"/>
    <rect x="26" y="168" width="24" height="6" rx="3" fill="white" opacity=".8"/>
    <rect x="28" y="171" width="6" height="2.5" rx="1" fill="${d.accent}" opacity=".7"/>
    <rect x="60" y="168" width="24" height="14" rx="7" fill="#EEF2FF"/>
    <rect x="60" y="168" width="24" height="6" rx="3" fill="white" opacity=".8"/>
    <rect x="62" y="171" width="6" height="2.5" rx="1" fill="${d.accent}" opacity=".7"/>

    <!-- Joggings navy avec bande bleue -->
    <rect x="30" y="128" width="22" height="45" rx="10" fill="#1E293B"/>
    <rect x="62" y="128" width="22" height="45" rx="10" fill="#1E293B"/>
    <rect x="30" y="128" width="4" height="45" rx="2" fill="${d.accent}" opacity=".35"/>
    <rect x="62" y="128" width="4" height="45" rx="2" fill="${d.accent}" opacity=".35"/>

    <!-- Hoodie bleu -->
    <path d="M20 86 C20 78 90 78 90 86 L92 134 C92 139 87 143 82 143 L28 143 C23 143 18 139 18 134 Z" fill="${d.accent}"/>
    <!-- Poche kangourou -->
    <rect x="37" y="116" width="36" height="24" rx="9" fill="${d.dark}" opacity=".55"/>
    <!-- Couture centrale -->
    <line x1="55" y1="80" x2="55" y2="140" stroke="${d.dark}" stroke-width="1.5" opacity=".3" stroke-dasharray="4 3"/>
    <!-- Cordon hoodie -->
    <path d="M47 82 L43 96" stroke="${d.dark}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
    <path d="M63 82 L67 96" stroke="${d.dark}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>

    <!-- Bras gauche -->
    <path d="M21 90 C10 96 8 122 13 130" stroke="${d.accent}" stroke-width="18" stroke-linecap="round" fill="none"/>
    <!-- Bras droit -->
    <path d="M89 90 C100 96 102 122 97 130" stroke="${d.accent}" stroke-width="18" stroke-linecap="round" fill="none"/>
    <!-- Mains -->
    <circle cx="13" cy="132" r="10" fill="${d.skin}"/>
    <circle cx="97" cy="132" r="10" fill="${d.skin}"/>

    <!-- Cou -->
    <rect x="48" y="70" width="14" height="18" rx="6" fill="${d.skin}"/>

    <!-- Tête -->
    <circle cx="55" cy="50" r="28" fill="${d.skin}"/>
    <!-- Oreilles -->
    <ellipse cx="27" cy="52" rx="6" ry="8" fill="${d.skin}"/>
    <ellipse cx="83" cy="52" rx="6" ry="8" fill="${d.skin}"/>
    <!-- Lobe oreille -->
    <circle cx="27" cy="57" r="2.5" fill="#E0A080" opacity=".4"/>
    <circle cx="83" cy="57" r="2.5" fill="#E0A080" opacity=".4"/>

    <!-- Casquette -->
    <path d="M28 45 Q55 22 82 45" fill="#0F172A"/>
    <rect x="23" y="43" width="64" height="10" rx="5" fill="#0F172A"/>
    <!-- Visière -->
    <rect x="20" y="50" width="24" height="6" rx="3" fill="#0F172A"/>
    <!-- Logo casquette -->
    <circle cx="55" cy="33" r="6" fill="${d.accent}"/>
    <text x="55" y="37" text-anchor="middle" fill="white" font-size="7" font-weight="bold" font-family="sans-serif">L</text>
    <!-- Bande arrière casquette -->
    <rect x="73" y="49" width="10" height="5" rx="2.5" fill="#334155"/>

    <!-- Visage -->
    <!-- Sourcils francs -->
    <path d="M40 48 Q46 44 52 48" stroke="${d.hair}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M58 48 Q64 44 70 48" stroke="${d.hair}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <!-- Yeux -->
    <circle cx="46" cy="53" r="5" fill="#0F172A"/>
    <circle cx="64" cy="53" r="5" fill="#0F172A"/>
    <circle cx="47.8" cy="51" r="2.2" fill="white"/>
    <circle cx="65.8" cy="51" r="2.2" fill="white"/>
    <!-- Iris -->
    <circle cx="46" cy="53" r="2.5" fill="#3473F0"/>
    <circle cx="64" cy="53" r="2.5" fill="#3473F0"/>
    <!-- Nez -->
    <path d="M52 60 Q55 64 58 60" stroke="#D4856A" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".5"/>
    <!-- Sourire -->
    <path d="M46 67 Q55 74 64 67" stroke="${d.hair}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Joues rosées -->
    <circle cx="38" cy="60" r="5" fill="#F87171" opacity=".18"/>
    <circle cx="72" cy="60" r="5" fill="#F87171" opacity=".18"/>`;
  }

  else if (name === 'chloe') {
    specific = `
    <!-- Baskets crème -->
    <rect x="24" y="168" width="24" height="14" rx="7" fill="#FEF3C7"/>
    <rect x="24" y="168" width="24" height="6" rx="3" fill="white" opacity=".7"/>
    <rect x="26" y="171" width="5" height="2" rx="1" fill="${d.accent}" opacity=".6"/>
    <rect x="62" y="168" width="24" height="14" rx="7" fill="#FEF3C7"/>
    <rect x="62" y="168" width="24" height="6" rx="3" fill="white" opacity=".7"/>
    <rect x="64" y="171" width="5" height="2" rx="1" fill="${d.accent}" opacity=".6"/>

    <!-- Jean bleu foncé -->
    <rect x="28" y="126" width="22" height="47" rx="10" fill="#3B4A6B"/>
    <rect x="60" y="126" width="22" height="47" rx="10" fill="#3B4A6B"/>
    <!-- Couture jean -->
    <line x1="39" y1="126" x2="39" y2="172" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
    <line x1="71" y1="126" x2="71" y2="172" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>

    <!-- Top rouge/coral -->
    <path d="M22 86 C22 78 88 78 88 86 L86 132 C86 137 82 140 77 140 L33 140 C28 140 24 137 24 132 Z" fill="${d.accent}"/>
    <!-- Col arrondi -->
    <path d="M44 80 Q55 74 66 80" stroke="${d.dark}" stroke-width="2" fill="none" opacity=".3"/>
    <!-- Petits boutons déco -->
    <circle cx="55" cy="92"  r="2" fill="${d.dark}" opacity=".2"/>
    <circle cx="55" cy="100" r="2" fill="${d.dark}" opacity=".2"/>

    <!-- Bras gauche -->
    <path d="M23 88 C12 94 10 118 14 127" stroke="${d.accent}" stroke-width="17" stroke-linecap="round" fill="none"/>
    <!-- Bras droit -->
    <path d="M87 88 C98 94 100 118 96 127" stroke="${d.accent}" stroke-width="17" stroke-linecap="round" fill="none"/>
    <!-- Mains -->
    <circle cx="14" cy="129" r="10" fill="${d.skin}"/>
    <circle cx="96" cy="129" r="10" fill="${d.skin}"/>

    <!-- Cou -->
    <rect x="48" y="69" width="14" height="18" rx="6" fill="${d.skin}"/>

    <!-- Tête -->
    <circle cx="55" cy="48" r="28" fill="${d.skin}"/>
    <ellipse cx="27" cy="50" rx="6" ry="8" fill="${d.skin}"/>
    <ellipse cx="83" cy="50" rx="6" ry="8" fill="${d.skin}"/>

    <!-- Cheveux corps (queue haute) -->
    <ellipse cx="55" cy="38" rx="26" ry="12" fill="${d.hair}"/>
    <!-- Queue de cheval gauche -->
    <path d="M30 34 C14 28 10 50 16 62" stroke="${d.hair}" stroke-width="12" stroke-linecap="round" fill="none"/>
    <ellipse cx="17" cy="63" rx="7" ry="5" fill="${d.hair}" transform="rotate(-20 17 63)"/>
    <!-- Queue de cheval droite -->
    <path d="M80 34 C96 28 100 50 94 62" stroke="${d.hair}" stroke-width="12" stroke-linecap="round" fill="none"/>
    <ellipse cx="93" cy="63" rx="7" ry="5" fill="${d.hair}" transform="rotate(20 93 63)"/>
    <!-- Élastiques -->
    <circle cx="32" cy="33" r="5" fill="${d.accent}"/>
    <circle cx="78" cy="33" r="5" fill="${d.accent}"/>

    <!-- Frange -->
    <path d="M33 38 Q55 28 77 38" fill="${d.hair}" stroke="none"/>

    <!-- Visage -->
    <path d="M40 45 Q46 41 51 45" stroke="${d.hair}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M59 45 Q65 41 71 45" stroke="${d.hair}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="46" cy="50" r="5" fill="#1A0A05"/>
    <circle cx="64" cy="50" r="5" fill="#1A0A05"/>
    <circle cx="47.8" cy="48" r="2.2" fill="white"/>
    <circle cx="65.8" cy="48" r="2.2" fill="white"/>
    <circle cx="46" cy="50" r="2.5" fill="${d.accent}"/>
    <circle cx="64" cy="50" r="2.5" fill="${d.accent}"/>
    <path d="M50 57 Q55 62 60 57" stroke="${d.hair}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".5"/>
    <path d="M44 65 Q55 72 66 65" stroke="${d.hair}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="38" cy="56" r="5" fill="#F87171" opacity=".22"/>
    <circle cx="72" cy="56" r="5" fill="#F87171" opacity=".22"/>`;
  }

  else if (name === 'thomas') {
    specific = `
    <!-- Chaussures marron casual -->
    <rect x="25" y="168" width="24" height="14" rx="7" fill="#78350F"/>
    <rect x="25" y="168" width="24" height="4" rx="2" fill="#92400E" opacity=".6"/>
    <rect x="63" y="168" width="24" height="14" rx="7" fill="#78350F"/>
    <rect x="63" y="168" width="24" height="4" rx="2" fill="#92400E" opacity=".6"/>

    <!-- Chino gris clair -->
    <rect x="29" y="126" width="22" height="47" rx="10" fill="#D1D5DB"/>
    <rect x="61" y="126" width="22" height="47" rx="10" fill="#D1D5DB"/>
    <line x1="40" y1="126" x2="40" y2="172" stroke="rgba(0,0,0,.08)" stroke-width="1.5"/>
    <line x1="72" y1="126" x2="72" y2="172" stroke="rgba(0,0,0,.08)" stroke-width="1.5"/>

    <!-- Polo / chemise vert émeraude -->
    <path d="M21 86 C21 78 89 78 89 86 L88 136 C88 141 84 144 79 144 L31 144 C26 144 22 141 22 136 Z" fill="${d.accent}"/>
    <!-- Col polo -->
    <path d="M46 78 L50 88 L55 84 L60 88 L64 78" fill="${d.dark}" opacity=".35"/>
    <!-- Petits boutons -->
    <circle cx="55" cy="91"  r="2.2" fill="${d.dark}" opacity=".25"/>
    <circle cx="55" cy="99"  r="2.2" fill="${d.dark}" opacity=".25"/>
    <!-- Poche poitrine -->
    <rect x="62" y="90" width="16" height="14" rx="4" fill="${d.dark}" opacity=".18"/>

    <!-- Bras gauche -->
    <path d="M22 90 C11 96 9 120 14 128" stroke="${d.accent}" stroke-width="17" stroke-linecap="round" fill="none"/>
    <!-- Bras droit -->
    <path d="M88 90 C99 96 101 120 96 128" stroke="${d.accent}" stroke-width="17" stroke-linecap="round" fill="none"/>
    <!-- Mains -->
    <circle cx="14" cy="130" r="10" fill="${d.skin}"/>
    <circle cx="96" cy="130" r="10" fill="${d.skin}"/>

    <!-- Cou -->
    <rect x="48" y="70" width="14" height="17" rx="6" fill="${d.skin}"/>

    <!-- Tête -->
    <circle cx="55" cy="50" r="28" fill="${d.skin}"/>
    <ellipse cx="27" cy="52" rx="6" ry="8" fill="${d.skin}"/>
    <ellipse cx="83" cy="52" rx="6" ry="8" fill="${d.skin}"/>

    <!-- Cheveux ondulés brun moyen -->
    <path d="M30 46 C28 30 36 22 55 20 C74 22 82 30 80 46" fill="${d.hair}"/>
    <path d="M30 46 C33 38 38 36 43 40" fill="${d.hair}" opacity=".6"/>
    <path d="M80 46 C77 38 72 36 67 40" fill="${d.hair}" opacity=".6"/>
    <!-- Mèche décontractée -->
    <path d="M44 26 C46 34 50 36 52 38" stroke="${d.hair}" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>

    <!-- Lunettes — monture fine -->
    <rect x="34" y="46" width="17" height="13" rx="5" fill="none" stroke="#374151" stroke-width="2.2"/>
    <rect x="57" y="46" width="17" height="13" rx="5" fill="none" stroke="#374151" stroke-width="2.2"/>
    <!-- Pont de lunettes -->
    <line x1="51" y1="52" x2="57" y2="52" stroke="#374151" stroke-width="2.2"/>
    <!-- Branches -->
    <line x1="34" y1="52" x2="26" y2="52" stroke="#374151" stroke-width="2.2"/>
    <line x1="74" y1="52" x2="82" y2="52" stroke="#374151" stroke-width="2.2"/>
    <!-- Reflets lunettes -->
    <path d="M36 49 L40 49" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>
    <path d="M59 49 L63 49" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>

    <!-- Yeux (derrière lunettes) -->
    <circle cx="42" cy="53" r="4.5" fill="#1A1A2E"/>
    <circle cx="65" cy="53" r="4.5" fill="#1A1A2E"/>
    <circle cx="43.5" cy="51.5" r="2" fill="white"/>
    <circle cx="66.5" cy="51.5" r="2" fill="white"/>
    <circle cx="42" cy="53" r="2.2" fill="${d.accent}"/>
    <circle cx="65" cy="53" r="2.2" fill="${d.accent}"/>

    <!-- Sourcils -->
    <path d="M36 44 Q42 40 48 44" stroke="${d.hair}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M58 44 Q64 40 70 44" stroke="${d.hair}" stroke-width="2.2" fill="none" stroke-linecap="round"/>

    <!-- Nez -->
    <path d="M52 61 Q55 65 58 61" stroke="#C4926A" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".45"/>
    <!-- Sourire légèrement en coin -->
    <path d="M46 68 Q55 74 65 68" stroke="${d.hair}" stroke-width="2.3" fill="none" stroke-linecap="round"/>
    <circle cx="38" cy="59" r="4" fill="#F87171" opacity=".15"/>
    <circle cx="72" cy="59" r="4" fill="#F87171" opacity=".15"/>`;
  }

  else if (name === 'bruna') {
    specific = `
    <!-- Bottines sombres -->
    <rect x="24" y="164" width="24" height="18" rx="7" fill="#1F2937"/>
    <rect x="24" y="164" width="24" height="6" rx="3" fill="#374151" opacity=".7"/>
    <rect x="62" y="164" width="24" height="18" rx="7" fill="#1F2937"/>
    <rect x="62" y="164" width="24" height="6" rx="3" fill="#374151" opacity=".7"/>

    <!-- Pantalon tailleur noir -->
    <rect x="28" y="126" width="22" height="42" rx="10" fill="#111827"/>
    <rect x="60" y="126" width="22" height="42" rx="10" fill="#111827"/>
    <line x1="39" y1="126" x2="39" y2="168" stroke="rgba(255,255,255,.08)" stroke-width="1.5"/>
    <line x1="71" y1="126" x2="71" y2="168" stroke="rgba(255,255,255,.08)" stroke-width="1.5"/>

    <!-- Blazer violet -->
    <path d="M19 84 C19 76 91 76 91 84 L91 140 C91 146 86 149 80 149 L30 149 C24 149 19 146 19 140 Z" fill="${d.accent}"/>
    <!-- Revers blazer gauche -->
    <path d="M42 76 L38 100 L55 92 Z" fill="${d.dark}" opacity=".45"/>
    <!-- Revers blazer droit -->
    <path d="M68 76 L72 100 L55 92 Z" fill="${d.dark}" opacity=".45"/>
    <!-- Col roulé dessous (violet foncé) -->
    <rect x="46" y="76" width="18" height="16" rx="5" fill="${d.dark}"/>
    <!-- Bouton blazer -->
    <circle cx="55" cy="114" r="3.5" fill="${d.dark}" opacity=".5"/>
    <circle cx="55" cy="128" r="3.5" fill="${d.dark}" opacity=".35"/>

    <!-- Bras gauche -->
    <path d="M20 88 C9 94 8 122 13 130" stroke="${d.accent}" stroke-width="19" stroke-linecap="round" fill="none"/>
    <!-- Manchette blazer -->
    <rect x="6" y="122" width="14" height="12" rx="5" fill="${d.dark}" opacity=".4"/>
    <!-- Bras droit -->
    <path d="M90 88 C101 94 102 122 97 130" stroke="${d.accent}" stroke-width="19" stroke-linecap="round" fill="none"/>
    <rect x="90" y="122" width="14" height="12" rx="5" fill="${d.dark}" opacity=".4"/>
    <!-- Mains -->
    <circle cx="13" cy="132" r="10" fill="${d.skin}"/>
    <circle cx="97" cy="132" r="10" fill="${d.skin}"/>

    <!-- Cou -->
    <rect x="48" y="68" width="14" height="18" rx="6" fill="${d.skin}"/>

    <!-- Tête -->
    <circle cx="55" cy="48" r="28" fill="${d.skin}"/>
    <ellipse cx="27" cy="50" rx="6" ry="8" fill="${d.skin}"/>
    <ellipse cx="83" cy="50" rx="6" ry="8" fill="${d.skin}"/>

    <!-- Cheveux longs (derrière) -->
    <path d="M28 44 C22 58 24 90 30 108" stroke="${d.hair}" stroke-width="22" stroke-linecap="round" fill="none"/>
    <path d="M82 44 C88 58 86 90 80 108" stroke="${d.hair}" stroke-width="22" stroke-linecap="round" fill="none"/>
    <!-- Volume haut de tête -->
    <path d="M30 42 Q55 18 80 42" fill="${d.hair}"/>
    <!-- Raie au milieu -->
    <line x1="55" y1="20" x2="55" y2="40" stroke="${d.dark}" stroke-width="2" opacity=".4"/>
    <!-- Mèche sur front -->
    <path d="M38 36 C42 44 46 44 50 46" stroke="${d.hair}" stroke-width="8" stroke-linecap="round" fill="none"/>

    <!-- Visage -->
    <!-- Sourcils fins et arqués -->
    <path d="M39 44 Q46 39 52 43" stroke="${d.hair}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M58 43 Q65 39 72 44" stroke="${d.hair}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <!-- Yeux en amande -->
    <ellipse cx="46" cy="50" rx="6" ry="5" fill="#0A0609"/>
    <ellipse cx="64" cy="50" rx="6" ry="5" fill="#0A0609"/>
    <circle cx="47.5" cy="48.5" r="2" fill="white"/>
    <circle cx="65.5" cy="48.5" r="2" fill="white"/>
    <circle cx="46" cy="50" r="2.8" fill="${d.accent}"/>
    <circle cx="64" cy="50" r="2.8" fill="${d.accent}"/>
    <!-- Cils -->
    <path d="M40 47 C41 44 43 43 46 44" stroke="${d.hair}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M70 47 C69 44 67 43 64 44" stroke="${d.hair}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <!-- Nez fin -->
    <path d="M52 57 Q55 62 58 57" stroke="#A0705A" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".5"/>
    <!-- Lèvres marquées -->
    <path d="M47 66 Q55 72 63 66" stroke="${d.hair}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M49 66 Q55 64 61 66" stroke="${d.dark}" stroke-width="1" fill="none" opacity=".3"/>
    <!-- Boucles d'oreilles -->
    <circle cx="27" cy="55" r="3" fill="${d.accent}" opacity=".9"/>
    <circle cx="83" cy="55" r="3" fill="${d.accent}" opacity=".9"/>
    <circle cx="27" cy="61" r="2" fill="${d.accent}" opacity=".7"/>
    <circle cx="83" cy="61" r="2" fill="${d.accent}" opacity=".7"/>`;
  }

  return `<svg
    width="${displaySize}"
    height="${Math.round(displaySize * 200 / 110)}"
    viewBox="0 0 110 200"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Personnage ${name}">
    <!-- Ombre au sol -->
    <ellipse cx="55" cy="195" rx="30" ry="6" fill="rgba(0,0,0,0.08)"/>
    ${specific}
  </svg>`;

}

/* ═══════════════════════════════════════════════════════════════
   STICKMAN — icône SVG propre viewBox 0 0 40 62
   poses : 'stand' | 'walk-a' | 'walk-b' | 'hero'
   ═══════════════════════════════════════════════════════════════ */
function stickmanSVG({ color = '#C8C4BB', pose = 'stand', isHero = false, size = 36 } = {}) {
  const col = isHero ? C.gold : color;
  const sw = 3.0;
  const hw = 3.4;
  const r = 7;

  const halo = isHero ? `
    <circle cx="20" cy="8" r="13" fill="${col}" opacity=".15"/>
    <path d="M14 2 L15.8 6.5 L20 5 L18 8.5 L20 7.5 L22 8.5 L20 5 L24.2 6.5 L26 2 L20 5.5 Z"
          fill="${col}" opacity=".8"/>` : '';

  const P = {
    stand: {
      to: 'M20 16 L20 30',
      al: 'M20 21 L11 27', ar: 'M20 21 L29 27',
      ll: 'M20 30 L14 44 L13 57', lr: 'M20 30 L26 44 L27 57',
    },
    'walk-a': {
      to: 'M20 17 L19 30',
      al: 'M19 21 L28 26', ar: 'M19 21 L11 24',
      ll: 'M19 30 L12 43 L10 56', lr: 'M19 30 L26 42 L31 54',
    },
    'walk-b': {
      to: 'M20 17 L21 30',
      al: 'M21 21 L12 26', ar: 'M21 21 L30 24',
      ll: 'M21 30 L28 43 L30 56', lr: 'M21 30 L14 42 L9  54',
    },
    hero: {
      to: 'M20 16 L20 30',
      al: 'M20 20 L9  11', ar: 'M20 20 L31 11',
      ll: 'M20 30 L14 44 L13 57', lr: 'M20 30 L26 44 L27 57',
    },
  };

  const p = P[pose] ?? P.stand;
  const lc = 'round';
  const lj = 'round';

  return `<svg width="${size}" height="${Math.round(size * 62 / 40)}"
    viewBox="0 0 40 62" xmlns="http://www.w3.org/2000/svg"
    style="display:block;overflow:visible">
    ${halo}
    <circle cx="20" cy="8" r="${r}" fill="none"
      stroke="${col}" stroke-width="${hw}" stroke-linejoin="${lj}"/>
    <circle cx="17" cy="7"  r="1" fill="${col}" opacity=".75"/>
    <circle cx="23" cy="7"  r="1" fill="${col}" opacity=".75"/>
    <path d="M17 11 Q20 13 23 11" stroke="${col}" stroke-width="1.3"
      fill="none" stroke-linecap="${lc}" opacity=".6"/>
    <path d="${p.to}" stroke="${col}" stroke-width="${sw}"
      stroke-linecap="${lc}" fill="none"/>
    <path d="${p.al}" stroke="${col}" stroke-width="${sw - .4}"
      stroke-linecap="${lc}" stroke-linejoin="${lj}" fill="none"/>
    <path d="${p.ar}" stroke="${col}" stroke-width="${sw - .4}"
      stroke-linecap="${lc}" stroke-linejoin="${lj}" fill="none"/>
    <path d="${p.ll}" stroke="${col}" stroke-width="${sw}"
      stroke-linecap="${lc}" stroke-linejoin="${lj}" fill="none"/>
    <path d="${p.lr}" stroke="${col}" stroke-width="${sw}"
      stroke-linecap="${lc}" stroke-linejoin="${lj}" fill="none"/>
    ${isHero ? `<circle cx="20" cy="23" r="3" fill="${col}" opacity=".85"/>` : ''}
  </svg>`;
}

/* ═══════════════════════════════════════════════════════════════
   GRILLE DE STICKMEN ANIMÉS
   ═══════════════════════════════════════════════════════════════ */
/* Compteur global pour les clipPath IDs uniques */
let _pictoClipId = 0;

/* Stickman à moitié coloré (gauche = couleur, droite = gris) */
function stickmanHalfSVG(color, size = 34) {
  const id = 'half-clip-' + (++_pictoClipId);
  const w = size;
  const h = Math.round(size * 62 / 40);
  const sw = 3.0;
  const hw = 3.4;
  const r = 7;
  const p = {
    to: 'M20 17 L19 30', al: 'M19 21 L28 26', ar: 'M19 21 L11 24',
    ll: 'M19 30 L12 43 L10 56', lr: 'M19 30 L26 42 L31 54'
  };
  const lc = 'round'; const lj = 'round';

  const body = `
    <circle cx="20" cy="8" r="${r}" fill="none" stroke="COLOR" stroke-width="${hw}"/>
    <circle cx="17" cy="7" r="1" fill="COLOR" opacity=".75"/>
    <circle cx="23" cy="7" r="1" fill="COLOR" opacity=".75"/>
    <path d="M17 11 Q20 13 23 11" stroke="COLOR" stroke-width="1.3" fill="none" stroke-linecap="${lc}" opacity=".6"/>
    <path d="${p.to}" stroke="COLOR" stroke-width="${sw}" stroke-linecap="${lc}" fill="none"/>
    <path d="${p.al}" stroke="COLOR" stroke-width="${sw - .4}" stroke-linecap="${lc}" stroke-linejoin="${lj}" fill="none"/>
    <path d="${p.ar}" stroke="COLOR" stroke-width="${sw - .4}" stroke-linecap="${lc}" stroke-linejoin="${lj}" fill="none"/>
    <path d="${p.ll}" stroke="COLOR" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}" fill="none"/>
    <path d="${p.lr}" stroke="COLOR" stroke-width="${sw}" stroke-linecap="${lc}" stroke-linejoin="${lj}" fill="none"/>`;

  return `<svg width="${w}" height="${h}" viewBox="0 0 40 62"
    xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible">
    <defs>
      <clipPath id="${id}"><rect x="0" y="0" width="20" height="62"/></clipPath>
    </defs>
    <!-- Base grise -->
    <g>${body.replace(/COLOR/g, C.muted)}</g>
    <!-- Moitié gauche colorée -->
    <g clip-path="url(#${id})">${body.replace(/COLOR/g, color)}</g>
  </svg>`;
}

function buildPictoGrid(container, {
  total = 10,
  active = 5,
  color = '#888',
  heroIndex = -1,
  heroName = null,
  label = '',
  pct = null,
} = {}) {
  container.innerHTML = '';

  /* ── Label seul au-dessus ── */
  if (label) {
    const lbl = document.createElement('p');
    lbl.className = 'picto-grid__label-text';
    lbl.textContent = label;
    container.appendChild(lbl);
  }

  /* ── Ligne stickmen + % alignés sur le même axe ── */
  const row = document.createElement('div');
  row.className = 'picto-grid__row';

  const wrap = document.createElement('div');
  wrap.className = 'picto-grid picto-grid--row';
  row.appendChild(wrap);

  if (pct !== null) {
    const pctEl = document.createElement('strong');
    pctEl.className = 'picto-grid__pct';
    pctEl.textContent = pct + '%';
    row.appendChild(pctEl);
  }

  container.appendChild(row);

  const STICK = 34;

  /* Détecter le stickman "demi" : quand pct n'est pas multiple de 10 */
  const exactActive = pct !== null ? pct / 10 : active;
  const fullActive = Math.floor(exactActive);
  const hasHalf = (exactActive - fullActive) >= 0.3 && fullActive < total;
  const halfIdx = hasHalf ? fullActive : -1; /* index du stickman demi-coloré */
  /* active recalculé : on inclut le demi dans le décompte */
  const effectiveActive = hasHalf ? fullActive : active;

  const items = [];
  for (let i = 0; i < total; i++) {
    const isHalf = i === halfIdx;
    const isActive = !isHalf && i < effectiveActive;
    const isHero = i === heroIndex;
    const col = isActive ? color : C.muted;

    const span = document.createElement('span');
    span.className = 'picto-grid__item' + (isActive || isHalf ? ' picto-grid__item--active' : '');

    if (isHero && heroName) {
      span.innerHTML = avatarSVG(heroName, STICK);
    } else if (isHalf) {
      span.innerHTML = stickmanHalfSVG(color, STICK);
    } else {
      span.innerHTML = stickmanSVG({
        color: col,
        pose: isActive ? 'walk-a' : 'stand',
        isHero: false,
        size: STICK,
      });
    }

    gsap.set(span, { opacity: 0, y: 18, scale: 0.7 });
    wrap.appendChild(span);
    items.push({ span, col, isActive, isHalf, isHero, idx: i });
  }

  ScrollTrigger.create({
    trigger: container,
    start: 'top 82%',
    once: true,
    onEnter: () => {
      gsap.to(wrap.querySelectorAll('.picto-grid__item'), {
        opacity: 1, y: 0, scale: 1,
        duration: 0.4,
        stagger: { each: 0.05, from: 'start' },
        ease: 'power2.out',
        onComplete: startWalk,
      });
    },
  });

  function startWalk() {
    items.forEach(({ span, col, isActive, isHalf, isHero, idx }) => {

      /* Actifs non-héros : marche désynchronisée */
      if (isActive && !isHero) {
        const speed = 0.46 + (idx % 4) * 0.06;
        const delay = idx * 0.09;
        let phase = idx % 2;
        function step() {
          phase = (phase + 1) % 2;
          span.innerHTML = stickmanSVG({
            color: col,
            pose: phase === 0 ? 'walk-a' : 'walk-b',
            isHero: false, size: STICK,
          });
          gsap.to(span, {
            y: phase === 0 ? -3 : 0,
            duration: speed, ease: 'sine.inOut', onComplete: step,
          });
        }
        gsap.delayedCall(delay, step);
      }

      /* Demi-stickman : balancement léger, garde son apparence */
      if (isHalf) {
        gsap.to(span, {
          y: -1, duration: 2.2,
          repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      }

      /* Inactifs : balancement lent */
      if (!isActive && !isHalf) {
        gsap.to(span, {
          y: -1.5, duration: 1.8 + idx * 0.13,
          repeat: -1, yoyo: true, ease: 'sine.inOut', delay: idx * 0.18,
        });
      }

      /* Héros Thomas : petit bob vertical */
      if (isHero && heroName) {
        gsap.to(span, {
          y: -4, duration: 0.7,
          repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.3,
        });
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   UI GLOBAUX
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   CHARSYSTEM — barre fixe + vols entre barre et folds
   ═══════════════════════════════════════════════════════════════ */
const CharSystem = (() => {
  const ORDER = ['louis', 'chloe', 'thomas', 'bruna'];
  let bar = null;
  const slots = {};
  const active = new Set();

  function fly(html, fr, tr, ws, we, delay, cb) {
    if (!fr || !tr) { cb?.(); return; }
    const el = document.createElement('div');
    el.className = 'char-flier';
    el.innerHTML = html;
    document.body.appendChild(el);
    gsap.set(el, {
      left: fr.left + fr.width / 2,
      top: fr.top + fr.height / 2,
      xPercent: -50, yPercent: -50,
      width: ws, autoAlpha: 1,
    });
    gsap.to(el, {
      left: tr.left + tr.width / 2,
      top: tr.top + tr.height / 2,
      width: we,
      duration: 0.75, delay, ease: 'power1.inOut',
      onComplete: () => { el.remove(); cb?.(); },
    });
  }

  return {
    ORDER,

    init() {
      bar = document.createElement('div');
      bar.className = 'char-bar';
      document.body.appendChild(bar);

      ORDER.forEach(name => {
        const slot = document.createElement('div');
        slot.className = 'char-bar__slot';

        const av = document.createElement('div');
        av.className = 'char-bar__av';
        av.innerHTML = avatarSVG(name, 44);

        const nm = document.createElement('span');
        nm.className = 'char-bar__nm';
        nm.textContent = name[0].toUpperCase() + name.slice(1);

        /* ── Bulle de présentation au hover ── */
        const tooltip = document.createElement('div');
        tooltip.className = 'char-bar__tooltip';
        const texts = {
          louis: 'Étudiant de gymnase en communication.',
          chloe: 'Étudiante en apprentissage vétérinaire.',
          thomas: 'Étudiant en Bachelor Ingénierie des médias.',
          bruna: 'Étudiante en Master de criminologie.',
        };
        tooltip.textContent = texts[name] ?? name;
        gsap.set(tooltip, { autoAlpha: 0, y: 6 });

        slot.addEventListener('mouseenter', () => {
          gsap.to(tooltip, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' });
        });
        slot.addEventListener('mouseleave', () => {
          gsap.to(tooltip, { autoAlpha: 0, y: 6, duration: 0.2, ease: 'power2.in' });
        });

        slot.appendChild(av);
        slot.appendChild(nm);
        slot.appendChild(tooltip);
        bar.appendChild(slot);
        slots[name] = { slot, av };
      });

      gsap.set(bar, { yPercent: -110, autoAlpha: 0 });
    },

    show(delay = 0) {
      gsap.to(bar, { yPercent: 0, autoAlpha: 1, duration: 0.55, delay, ease: 'power2.out' });
    },

    hide() {
      gsap.to(bar, { yPercent: -110, autoAlpha: 0, duration: 0.45, ease: 'power2.in' });
    },

    slotRect(name) {
      return slots[name]?.av?.getBoundingClientRect?.() ?? null;
    },

    dim(name) {
      const av = slots[name]?.av;
      if (av) gsap.to(av, { opacity: 0.18, scale: 0.8, duration: 0.3 });
    },

    undim(name) {
      const av = slots[name]?.av;
      if (av) gsap.to(av, { opacity: 1, scale: 1, duration: 0.35 });
    },

    summon(name, targetEl, size, onDone) {
      if (!targetEl) return;
      size = size ?? 130;

      if (active.has(name)) {
        if (!targetEl.innerHTML) targetEl.innerHTML = avatarSVG(name, size);
        onDone?.();
        return;
      }

      active.add(name);
      const sr = this.slotRect(name);
      const tr = targetEl.getBoundingClientRect();
      this.dim(name);

      fly(avatarSVG(name, size), sr, tr, 44, size, 0, () => {
        targetEl.innerHTML = avatarSVG(name, size);
        onDone?.();
      });
    },

    dismiss(name, fromEl, { skipReturn = false, delay = 0 } = {}) {
      if (!active.has(name)) return;

      if (skipReturn) {
        if (fromEl) fromEl.innerHTML = '';
        return;
      }

      active.delete(name);

      if (!fromEl || !fromEl.innerHTML) {
        this.undim(name);
        return;
      }

      const fr = fromEl.getBoundingClientRect();
      const sr = this.slotRect(name);
      const w = fromEl.offsetWidth || 130;
      const html = fromEl.innerHTML;
      fromEl.innerHTML = '';

      gsap.delayedCall(delay, () => {
        fly(html, fr, sr, w, 44, 0, () => this.undim(name));
      });
    },

    transfer(name, fromEl, toEl, size, onDone) {
      if (!fromEl || !toEl) return;
      size = size ?? 130;
      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();
      const html = avatarSVG(name, size);
      fromEl.innerHTML = '';
      fly(html, fr, tr, fromEl.offsetWidth || size, size, 0, () => {
        toEl.innerHTML = avatarSVG(name, size);
        onDone?.();
      });
    },

    dismissAll(sourceMap) {
      ORDER.forEach(name => {
        const el = sourceMap?.[name];
        this.dismiss(name, el ?? null);
      });
    },

    flyAllToBar(sources) {
      const tl = gsap.timeline();

      ORDER.forEach(name => {
        const srcEl = sources[name];
        const charEl = srcEl?.closest('.character') ?? srcEl;
        if (charEl) tl.to(charEl, {
          autoAlpha: 0,
          duration: 0.4,
          ease: 'power2.inOut'
        }, 0); 
        active.delete(name);
        this.undim(name);
      });

      gsap.set(bar, { yPercent: -100, autoAlpha: 0 });
      tl.to(bar, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.3); 
    },
  };
})();


function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  gsap.to(bar, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
  });
}


function initSeriesLabel() {
  const SOURCE = '"Sport et études - HEIG-VD - 26", Ait-Slimane R., Blanchard R. & Demont C., HEIG-VD\n"Enquête sur le sport universitaire suisse", Gebert A., Knäbel A. & Lamprecht M.';

  const source = document.createElement('div');
  source.className = 'source-label visible';
  source.textContent = SOURCE;
  document.body.appendChild(source);
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 1 — Intro protagonistes
   ═══════════════════════════════════════════════════════════════ */
function initFold1() {
  const fold = document.getElementById('fold-1');
  if (!fold) return;

  const NAMES = ['louis', 'chloe', 'thomas', 'bruna'];
  const charEls = fold.querySelectorAll('.character');
  const subtitle = fold.querySelector('.fold__subtitle');

  charEls.forEach(el => {
    const name = el.dataset.name;
    const av = el.querySelector('.character__avatar');
    if (av && name) av.innerHTML = avatarSVG(name, 130);
  });

  gsap.set(charEls, { autoAlpha: 0, y: 55 });
  if (subtitle) gsap.set(subtitle, { autoAlpha: 0, y: 18 });

  const tl = gsap.timeline();
  charEls.forEach((el, i) => {
    tl.to(el, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, i);
  });
  if (subtitle) tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.6 }, NAMES.length - 0.2);

  ScrollTrigger.create({
    trigger: fold,
    start: 'top top',
    end: '+=350%',
    pin: true,
    scrub: 0.8,
    animation: tl,

    onLeave: () => {
      const sources = {};
      charEls.forEach(el => {
        const name = el.dataset.name;
        const av = el.querySelector('.character__avatar');
        if (name && av) sources[name] = av;
        gsap.killTweensOf(el);
        el.querySelectorAll('*').forEach(child => gsap.killTweensOf(child));
        gsap.set(el, { autoAlpha: 0 });
      });
      CharSystem.flyAllToBar(sources);
    },

    onEnterBack: () => {
      const tl2 = gsap.timeline();
      tl2.to(document.querySelector('.char-bar'), {
        yPercent: -110, autoAlpha: 0, duration: 0.5, ease: 'power2.inOut'
      }, 0);
      charEls.forEach(el => {
        const av = el.querySelector('.character__avatar');
        if (av && !av.innerHTML) {
          const name = el.dataset.name;
          if (name) av.innerHTML = avatarSVG(name, 130);
        }
        gsap.set(el, { y: -14 });
        tl2.to(el, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0);
      });
      if (subtitle) tl2.to(subtitle, { autoAlpha: 1, duration: 0.4 }, 0.1);
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 2 — Gymnase & Apprentissage
   ═══════════════════════════════════════════════════════════════ */

const GRID_COLS = 20;
const GRID_ROWS = 5;
const GRID_TOTAL = 100;
const STICK_SIZE = 22;
const STICK_GAP = 3;

function animateGrid(items) {
  const loops = [];
  items.forEach(({ wrap, col, isActive, isHero, idx }) => {

    if (!isActive) {
      const t = gsap.to(wrap, {
        y: -1.5, duration: 1.9 + (idx % 7) * 0.15,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
        delay: (idx % 11) * 0.12,
      });
      loops.push(t);
      return;
    }

    const speed = 0.40 + (idx % 7) * 0.04;
    const delay = (idx % 13) * 0.06;
    let phase = idx % 2;
    let killed = false;

    function step() {
      if (killed) return;
      phase = (phase + 1) % 2;
      const pose = phase === 0 ? 'walk-a' : 'walk-b';
      if (!isHero) {
        wrap.innerHTML = stickmanSVG({ color: col, pose, isHero: false, size: STICK_SIZE });
      }
      const t = gsap.to(wrap, {
        y: phase === 0 ? -3 : 0,
        duration: speed, ease: 'sine.inOut', onComplete: step,
      });
      loops.push(t);
    }
    const dc = gsap.delayedCall(delay, step);
    loops.push(dc);
  });
  return loops;
}

function resetGrid(items, heroName) {
  items.forEach(({ wrap, col, isActive, isHero, idx }) => {
    gsap.killTweensOf(wrap);
    if (isHero) {
      wrap.innerHTML = avatarSVG(heroName, STICK_SIZE);
    } else {
      wrap.innerHTML = stickmanSVG({
        color: col,
        pose: idx % 2 === 0 ? 'walk-a' : 'walk-b',
        isHero: false, size: STICK_SIZE,
      });
    }
    gsap.set(wrap, { opacity: 0, y: 10, scale: 0.75 });
  });
}

function initFold2() {
  const fold = document.getElementById('fold-2');
  if (!fold) return;

  const tickWrap = document.createElement('div'); tickWrap.className = 'ticker-wrap';
  const tick = document.createElement('div'); tick.className = 'ticker';
  tick.innerHTML = (' GYMNASE · APPRENTISSAGE ·').repeat(6);
  tickWrap.appendChild(tick);
  fold.insertBefore(tickWrap, fold.querySelector('.fold__title'));
  gsap.to(tick, { x: '-50%', duration: 20, repeat: -1, ease: 'none' });

  const BLOCS = [
    { sel: '.stat-block--light', pct: sportData.gymnasiens.pratiquent_sport_regulier_pct, color: C.louis, heroName: 'louis' },
    { sel: '.stat-block--dark', pct: sportData.apprentis.pratiquent_sport_regulier_pct, color: C.chloe, heroName: 'chloe' },
  ];

  BLOCS.forEach(({ sel, pct, color, heroName }) => {
    const block = fold.querySelector(sel);
    const pictC = block?.querySelector('.stat-block__pictogram');
    if (!block || !pictC) return;

    const activeN = Math.round((pct / 100) * GRID_TOTAL);
    const heroIdx = activeN - 1;

    pictC.innerHTML = '';
    pictC.style.cssText = [
      'display:grid',
      `grid-template-columns:repeat(${GRID_COLS}, ${STICK_SIZE}px)`,
      `gap:${STICK_GAP}px`,
      'width:fit-content',
      'max-width:100%',
      'margin:0 auto',
      'overflow:visible',
    ].join(';');

    const items = [];

    for (let i = 0; i < GRID_TOTAL; i++) {
      const isActive = i < activeN;
      const isHero = i === heroIdx;
      const col = isActive ? color : C.muted;

      const cell = document.createElement('div');
      cell.style.cssText = 'line-height:0;display:flex;align-items:flex-end;justify-content:center;';

      const wrap = document.createElement('div');
      wrap.style.cssText = 'line-height:0;';

      if (isHero) {
        wrap.innerHTML = avatarSVG(heroName, STICK_SIZE);
      } else {
        wrap.innerHTML = stickmanSVG({ color: col, pose: i % 2 === 0 ? 'walk-a' : 'walk-b', isHero: false, size: STICK_SIZE });
      }

      gsap.set(wrap, { opacity: 0, y: 10, scale: 0.75 });
      cell.appendChild(wrap);
      pictC.appendChild(cell);
      items.push({ wrap, col, isActive, isHero, idx: i });
    }

    let gridLoops = [];
    let heroFlier = null;

    function enter() {
      CharSystem.dim(heroName);

      requestAnimationFrame(() => {
        const heroWrap = items[heroIdx].wrap;
        const heroCellEl = heroWrap.parentElement;

        requestAnimationFrame(() => {
          const slotRect = CharSystem.slotRect(heroName);
          const cellRect = heroCellEl?.getBoundingClientRect();

          if (slotRect && cellRect && cellRect.width > 0) {
            gsap.set(heroWrap, { opacity: 0 });

            const flier = document.createElement('div');
            flier.className = 'char-flier';
            flier.innerHTML = avatarSVG(heroName, 44);
            document.body.appendChild(flier);
            heroFlier = flier;

            gsap.set(flier, {
              left: slotRect.left + slotRect.width / 2,
              top: slotRect.top + slotRect.height / 2,
              xPercent: -50, yPercent: -50,
              width: 44, autoAlpha: 1,
            });

            gsap.to(flier, {
              left: cellRect.left + cellRect.width / 2,
              top: cellRect.top,
              width: STICK_SIZE,
              duration: 0.9, ease: 'power1.inOut',
              onComplete: () => {
                flier.remove();
                heroFlier = null;
                heroWrap.innerHTML = avatarSVG(heroName, STICK_SIZE);
                gsap.set(heroWrap, { opacity: 1, y: 0, scale: 1 });
              },
            });
          }
        });
      });

      const nonHero = items.filter(it => !it.isHero).map(it => it.wrap);
      gsap.to(nonHero, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.45,
        stagger: { each: 0.012, from: 'end', grid: [GRID_ROWS, GRID_COLS] },
        ease: 'back.out(1.4)',
        delay: 0.1,
        onComplete: () => { gridLoops = animateGrid(items); },
      });

      const numEl = block.querySelector('.stat-block__number');
      if (numEl) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: pct, duration: 1.8, ease: 'power2.out', delay: 0.3,
          onUpdate: () => { numEl.textContent = obj.val.toFixed(1) + '%'; },
        });
      }
    }

    function leave() {
      gridLoops.forEach(t => t?.kill?.());
      gridLoops = [];

      if (heroFlier) { heroFlier.remove(); heroFlier = null; }

      if (heroName === 'louis') {
        louisGridCell = items[heroIdx].wrap.parentElement ?? null;
      }

      CharSystem.undim(heroName);

      gsap.delayedCall(0.3, () => resetGrid(items, heroName));

      const numEl = block.querySelector('.stat-block__number');
      if (numEl) numEl.textContent = '0%';
    }

    ScrollTrigger.create({
      trigger: block,
      start: 'top 72%',
      end: 'bottom 20%',
      onEnter: enter,
      onLeave: leave,
      onEnterBack: enter,
      onLeaveBack: leave,
    });
  });

  gsap.from(fold.querySelectorAll('.stat-block'), {
    opacity: 0, x: -40, duration: 0.9, stagger: 0.2, ease: 'power3.out',
    scrollTrigger: { trigger: fold.querySelector('.stats-split'), start: 'top 68%' },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 3 — Louis : arrêts
   ═══════════════════════════════════════════════════════════════ */

let louisGridCell = null;
let redStickWraps = [];

function initFold3() {
  const fold = document.getElementById('fold-3');
  if (!fold) return;

  const fold4 = document.getElementById('fold-4');
  if (fold4) fold4.style.display = 'none';

  const charEl = fold.querySelector('.character');
  const avatarEl = fold.querySelector('.character__avatar');
  const bubbleEl = fold.querySelector('.character__bubble');
  const bigStat = fold.querySelector('.big-stat');
  const bigNum = fold.querySelector('.big-stat__number');

  avatarEl.innerHTML = avatarSVG('louis', 130);
  gsap.set(avatarEl, { autoAlpha: 1 });
  gsap.set(bubbleEl, { autoAlpha: 1, x: 0 });
  gsap.set(bigNum, { autoAlpha: 1, scale: 1 });

  const track = document.createElement('div');
  track.className = 'fold3-track';

  const panel1 = document.createElement('div');
  panel1.className = 'fold3-panel';
  panel1.appendChild(charEl);
  panel1.appendChild(bigStat);
  track.appendChild(panel1);

  const descriptions = [
    "Les journées sont remplies et il y a encore le travail à la maison après les cours.",
    "Des cours tous les jours pendant 8h laissent peu d'énergie pour le sport.",
    "Les étudiant·e·s n'habitent pas souvent dans la même ville que leur école et le trajet aller-retour peut être conséquent.",
  ];

  const reasonCards = [];
  sportData.gymnasiens.top3_raisons_arret.forEach((item, i) => {
    const panel = document.createElement('div');
    panel.className = 'fold3-panel fold3-panel--reason';

    const card = document.createElement('div');
    card.className = 'fold3-reason-card';
    card.innerHTML = `
      <span class="fold3-reason__rank">${item.rang}</span>
      <div class="fold3-reason__content">
        <p class="fold3-reason__text">${item.raison}</p>
        <p class="fold3-reason__desc">${descriptions[i] ?? ''}</p>
      </div>`;

    gsap.set(card, { x: 80, autoAlpha: 0 });
    panel.appendChild(card);
    track.appendChild(panel);
    reasonCards.push(card);
  });

  fold.appendChild(track);

  const PANELS = 4;

  const tl = gsap.timeline();
  tl.to(track, { x: () => -(track.scrollWidth - window.innerWidth), ease: 'none', duration: 3 });
  reasonCards.forEach((card, i) => {
    tl.to(card, { x: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.75 + i * 0.95);
  });

  ScrollTrigger.create({
    trigger: fold,
    start: 'top top',
    end: () => `+=${(PANELS - 1) * window.innerHeight}`,
    pin: true,
    scrub: 1.2,
    animation: tl,

    onEnter: () => {
      CharSystem.dim('louis');
      gsap.set(avatarEl, { autoAlpha: 1 });
    },

    onLeave: () => {
      louisGridCell = null;
      CharSystem.dismiss('louis', avatarEl);
      gsap.delayedCall(0.35, () => {
        gsap.set(avatarEl, { autoAlpha: 1 });
        gsap.set(bubbleEl, { autoAlpha: 1, x: 0 });
        avatarEl.innerHTML = avatarSVG('louis', 130);
      });
    },

    onEnterBack: () => {
      CharSystem.dim('louis');
      gsap.set(avatarEl, { autoAlpha: 1 });
      gsap.set(bubbleEl, { autoAlpha: 1, x: 0 });
    },

    onLeaveBack: () => {
      CharSystem.undim('louis');
      gsap.set(bubbleEl, { autoAlpha: 1, x: 0 });
    },
  });
}



function initFold4() { }

/* ═══════════════════════════════════════════════════════════════
   FOLD 5 — Quiz slider
   ═══════════════════════════════════════════════════════════════ */
function initFold5() {
  const fold = document.getElementById('fold-5');
  if (!fold) return;

  const avatarEl = fold.querySelector('.character__avatar');
  const quiz = fold.querySelector('.quiz-block');

  const bubble = document.createElement('div');
  bubble.className = 'character__bubble character__bubble--thomas-quiz';
  bubble.setAttribute('aria-live', 'polite');
  const charEl = fold.querySelector('.character');
  if (charEl) charEl.appendChild(bubble);
  gsap.set(bubble, { autoAlpha: 0, y: 6 });

  if (quiz) gsap.set(quiz, { autoAlpha: 0, y: 40 });

  let quizSolved = false;
  let lockedAt = null;

  function onScroll() {
    if (lockedAt === null) return;
    window.scrollTo({ top: lockedAt, behavior: 'instant' });
  }

  function lockScroll() {
    lockedAt = fold.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: lockedAt, behavior: 'instant' });
    window.addEventListener('scroll', onScroll);
  }

  function unlockScroll() {
    lockedAt = null;
    window.removeEventListener('scroll', onScroll);
  }

  function arrive() {
    CharSystem.undim('louis');
    CharSystem.summon('thomas', avatarEl, 130, () => {
      if (quiz) gsap.to(quiz, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    });
  }

  function depart() {
    if (quiz) gsap.to(quiz, { autoAlpha: 0, duration: 0.2 });
    gsap.to(bubble, { autoAlpha: 0, duration: 0.15 });
    gsap.delayedCall(0.1, () => CharSystem.dismiss('thomas', avatarEl));
  }

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', end: 'bottom top',
    onEnter: arrive, onLeave: depart, onEnterBack: arrive, onLeaveBack: depart,
  });

  /* Lock quand fold-5 atteint exactement le top du viewport */
  ScrollTrigger.create({
    trigger: fold,
    start: 'top top',
    onEnter: () => { if (!quizSolved) lockScroll(); },
    onEnterBack: () => { if (!quizSolved) lockScroll(); },
    onLeaveBack: () => { unlockScroll(); },
  });

  /* ── Quiz logic ── */
  const slider = document.getElementById('quiz-slider');
  const output = fold.querySelector('.quiz-block__output');
  const btn = fold.querySelector('.quiz-block__submit');
  const correct = sportData.bachelor.pratiquent_sport_regulier.source_quizz.pratiquent_regulier_pct;
  const TOLERANCE = 8;

  function showBubble(text, color) {
    bubble.textContent = text;
    bubble.style.borderColor = color + '55';
    gsap.fromTo(bubble,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }

  function hideBubble() {
    gsap.to(bubble, { autoAlpha: 0, y: 4, duration: 0.2 });
  }

  if (slider && output) {
    output.textContent = slider.value + '%';
    slider.addEventListener('input', () => {
      output.textContent = slider.value + '%';
      hideBubble();
    });
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const val = parseFloat(slider.value);
      const diff = Math.abs(val - correct);

      if (diff <= TOLERANCE) {

        quizSolved = true;
        unlockScroll();
        showBubble('🎉 Exactement ! Bien joué !', C.green);
        btn.textContent = '↓ Continue à scroller !';
        btn.style.pointerEvents = 'none';
        gsap.delayedCall(0.8, () => {
          gsap.to(window, { scrollTo: { y: '#fold-6', offsetY: 0 }, duration: 0.9, ease: 'power2.inOut' });
        });

      } else {
        /* ❌ Mauvaise réponse */
        gsap.timeline()
          .to(quiz, { x: -14, duration: 0.07 })
          .to(quiz, { x: 14, duration: 0.07 })
          .to(quiz, { x: -10, duration: 0.07 })
          .to(quiz, { x: 10, duration: 0.07 })
          .to(quiz, { x: 0, duration: 0.07 });

        if (diff > 30) showBubble('Raté… tu es loin ! Réessaie.', C.accent);
        else if (diff > 15) showBubble('Pas tout à fait… encore un effort !', C.gold);
        else showBubble('Tu brûles ! Encore un peu…', C.thomas);
      }
    });
  }
}
/* ═══════════════════════════════════════════════════════════════
   FOLD 6 — Révélation
   ═══════════════════════════════════════════════════════════════ */
function initFold6() {
  const fold = document.getElementById('fold-6');
  if (!fold) return;

  const pct = sportData.bachelor.pratiquent_sport_regulier.source_quizz.pratiquent_regulier_pct;
  const ticker = fold.querySelector('.reveal-banner__ticker');
  if (ticker) {
    ticker.innerHTML = (`${pct.toFixed(1)}% · `).repeat(50);
    gsap.to(ticker, { x: '-50%', duration: 20, repeat: -1, ease: 'none' });
  }

  const answer = fold.querySelector('.reveal-content__answer');
  const number = fold.querySelector('.reveal-content__number');
  gsap.set([answer, number], { scale: 0, opacity: 0 });

  ScrollTrigger.create({
    trigger: fold, start: 'top 60%', once: true,
    onEnter: () => {
      gsap.to(answer, { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1.2, 0.5)' });
      gsap.to(number, { scale: 1, opacity: 1, duration: 0.8, delay: 0.3, ease: 'back.out(2)' });
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 7 — Raisons de continuer (bachelor)
   ═══════════════════════════════════════════════════════════════ */
function initFold7() {
  const fold = document.getElementById('fold-7');
  if (!fold) return;

  const avatarEl = fold.querySelector('.character__avatar');
  const bubble = fold.querySelector('.character__bubble');

  if (bubble) gsap.set(bubble, { autoAlpha: 0, x: -20 });

  function arrive() {
    CharSystem.dim('thomas');
    CharSystem.summon('thomas', avatarEl, 130, () => {
      CharSystem.dim('thomas');
      if (bubble) gsap.to(bubble, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out' });
    });
    gsap.delayedCall(1.2, () => CharSystem.dim('thomas')); // ← re-dim après que tous les vols soient terminés
  }
  function depart() {
    if (bubble) gsap.to(bubble, { autoAlpha: 0, duration: 0.2 });
    gsap.delayedCall(0.1, () => CharSystem.dismiss('thomas', avatarEl));
    gsap.delayedCall(0.9, () => CharSystem.dim('thomas'));
  }

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', end: 'bottom top',
    onEnter: arrive, onLeave: depart, onEnterBack: arrive, onLeaveBack: depart,
  });

  const container = document.getElementById('bachelor-reasons-pictogram');
  if (!container) return;

  sportData.bachelor.top5_raisons_pratique_quizz.slice(0, 3).forEach(item => {
    const div = document.createElement('div');
    div.className = 'reason-picto-block';
    buildPictoGrid(div, {
      total: 10,
      active: Math.round(item.pct / 10),
      color: C.green,
      heroIndex: 0,
      heroName: 'thomas',
      label: item.raison,
      pct: item.pct,
    });
    container.appendChild(div);
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 8 — 100 stickmen bachelor
   ═══════════════════════════════════════════════════════════════ */


function initFold8() {
  const fold = document.getElementById('fold-8');
  if (!fold) return;

  const practPct = sportData.bachelor.pratiquent_sport_regulier.source_quizz.pratiquent_regulier_pct;
  const dropoutPct = Math.round(100 - practPct);

  const el = document.getElementById('bachelor-dropout-pct');
  if (el) {
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: fold, start: 'top 74%', once: true,
      onEnter: () => gsap.to(obj, {
        val: dropoutPct, duration: 1.8, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.val); },
      }),
    });
  }

  const pictoC = document.getElementById('bachelor-dropout-pictogram');
  if (!pictoC) return;

  const COLS = 20, ROWS = 5, TOTAL = 100, SZ = 22, GAP = 3;
  const greenN = TOTAL - dropoutPct;
  const thomasIdx = greenN - 1;

  pictoC.innerHTML = '';
  pictoC.style.cssText = [
    'display:grid',
    `grid-template-columns:repeat(${COLS}, ${SZ}px)`,
    `gap:${GAP}px`,
    'width:fit-content',
    'max-width:100%',
    'margin:0 auto',
    'overflow:visible',
  ].join(';');

  const items = [];
  for (let i = 0; i < TOTAL; i++) {
    const isGreen = i < greenN;
    const isThomas = i === thomasIdx;
    const col = isGreen ? C.green : C.accent;

    const cell = document.createElement('div');
    cell.style.cssText = 'line-height:0;display:flex;align-items:flex-end;justify-content:center;';

    const wrap = document.createElement('div');
    wrap.style.cssText = 'line-height:0;';

    if (isThomas) {
      wrap.innerHTML = avatarSVG('thomas', SZ);
    } else {
      wrap.innerHTML = stickmanSVG({
        color: col,
        pose: i % 2 === 0 ? 'walk-a' : 'walk-b',
        isHero: false, size: SZ,
      });
    }

    gsap.set(wrap, { opacity: 0, y: 12, scale: 0.7 });
    cell.appendChild(wrap);
    pictoC.appendChild(cell);
    items.push({ wrap, col, isGreen, isThomas, idx: i });
  }

  // Stocker les rouges pour la transition
  redStickWraps = items
    .filter(it => !it.isGreen && !it.isThomas)
    .map(it => it.wrap);

  let exitTimer = null;

  function launchExit() {
    redStickWraps.forEach(w => gsap.killTweensOf(w));

    gsap.to([...redStickWraps].reverse(), {
      x: 600,        // ← vers la droite
      opacity: 0,
      duration: 0.6, // ← plus rapide
      stagger: { each: 0.010, from: 'end' }, // ← part depuis la droite
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(window, {
          scrollTo: { y: '#fold-9', offsetY: 0 },
          duration: 0.8,
          ease: 'power2.inOut',
        });
      },
    });
  }

  ScrollTrigger.create({
    trigger: fold,
    start: 'top 68%',
    once: true,
    onEnter: () => {
      gsap.to(items.map(it => it.wrap), {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        stagger: { each: 0.012, from: 'random', grid: [ROWS, COLS] },
        ease: 'power2.out',
      });

      gsap.delayedCall(2.2, () => {
        const tl = gsap.timeline({
          onComplete: () => {
            animateF8(items);
            // ← 2.5s après que l'animation d'entrée soit finie, les rouges partent
            exitTimer = gsap.delayedCall(2.3, launchExit);
          },
        });
        tl.to(items.map(it => it.wrap), {
          scale: 0.75, y: 6,
          duration: 0.5, ease: 'power1.inOut',
        }).to(items.map(it => it.wrap), {
          scale: 1, y: 0,
          duration: 0.7,
          stagger: { each: 0.006, from: 'start', grid: [ROWS, COLS] },
          ease: 'power2.out',
        });
      });
    },
  });

  function animateF8(items) {
    items.forEach(({ wrap, col, isGreen, isThomas, idx }) => {
      if (isThomas) {
        gsap.to(wrap, { y: -3, duration: 0.65, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 });
        return;
      }
      if (isGreen) {
        const speed = 0.42 + (idx % 6) * 0.04;
        const delay = (idx % 13) * 0.06;
        let phase = idx % 2;
        function step() {
          phase = (phase + 1) % 2;
          wrap.innerHTML = stickmanSVG({ color: col, pose: phase === 0 ? 'walk-a' : 'walk-b', isHero: false, size: SZ });
          gsap.to(wrap, { y: phase === 0 ? -3 : 0, duration: speed, ease: 'sine.inOut', onComplete: step });
        }
        gsap.delayedCall(delay, step);
      } else {
        wrap.innerHTML = stickmanSVG({ color: col, pose: 'stand', isHero: false, size: SZ });
        gsap.to(wrap, { y: -1.5, duration: 2 + (idx % 7) * 0.15, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: (idx % 9) * 0.1 });
      }
    });
  }

  gsap.from(fold.querySelector('.fold__statement'), {
    opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', end: 'bottom top',
    onEnter: () => CharSystem.dim('thomas'),
    onLeave: () => CharSystem.undim('thomas'),
    onEnterBack: () => CharSystem.dim('thomas'),
    onLeaveBack: () => CharSystem.undim('thomas'),
  });
}

function initFold9() {
  const fold = document.getElementById('fold-9');
  if (!fold) return;

  const layout = document.createElement('div');
  layout.className = 'fold9-layout';

  const charWrap = document.createElement('div');
  charWrap.className = 'fold9-character';
  const avatarEl = document.createElement('div');
  avatarEl.className = 'character__avatar';
  const bubble = document.createElement('div');
  bubble.className = 'character__bubble';
  bubble.textContent = "Voici pourquoi tant d'étudiant·e·s arrêtent le sport…";
  charWrap.appendChild(avatarEl);
  charWrap.appendChild(bubble);

  const barSection = document.createElement('div');
  barSection.className = 'bar-chart';
  const barsContainer = document.getElementById('inactivite-bar-chart');
  barSection.appendChild(barsContainer);

  layout.appendChild(charWrap);
  layout.appendChild(barSection);

  const title = fold.querySelector('.fold__title');
  if (title && title.nextSibling) {
    fold.insertBefore(layout, title.nextSibling);
  } else {
    fold.appendChild(layout);
  }

  gsap.set(bubble, { autoAlpha: 0, x: -16 });

  function arrive() {
    CharSystem.dim('thomas');
    CharSystem.summon('thomas', avatarEl, 110, () => {
      CharSystem.dim('thomas');
      gsap.to(bubble, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out' });
    });
  }
  function depart() {
    gsap.to(bubble, { autoAlpha: 0, duration: 0.2 });
    gsap.delayedCall(0.1, () => CharSystem.dismiss('thomas', avatarEl));
  }

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', end: 'bottom top',
    onEnter: arrive, onLeave: depart, onEnterBack: arrive, onLeaveBack: depart,
  });

  const container = barsContainer;
  if (!container) return;

  const data = sportData.inactivite_globale.top5_raisons_inactivite_2025;
  const fills = [];

  data.forEach((item, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar-chart__bar';
    bar.innerHTML = `
      <div class="bar-chart__track">
        <div class="bar-chart__fill" style="background:${C.accent}">
          <span class="bar-chart__value">${item.pct_2025}%</span>
        </div>
      </div>
      <p class="bar-chart__label">${item.raison}</p>`;
    container.appendChild(bar);

    const fill = bar.querySelector('.bar-chart__fill');
    gsap.set(fill, { height: '0%' });
    fills.push({ fill, pct: item.pct_2025 });
  });

  // Barres se remplissent à l'entrée dans fold-9
  ScrollTrigger.create({
    trigger: fold,
    start: 'top 78%',
    once: true,
    onEnter: () => {
      fills.forEach(({ fill, pct }, i) => {
        gsap.to(fill, {
          height: `${pct}%`,
          duration: 1.2,
          delay: i * 0.15,
          ease: 'elastic.out(1, 0.55)',
        });
      });
    },
  });

  gsap.from(fold.querySelector('.fold__title'), {
    opacity: 0, y: 24, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 10 — Master, Bruna
   ═══════════════════════════════════════════════════════════════ */
function initFold10() {
  const fold = document.getElementById('fold-10');
  if (!fold) return;

  const avatarEl = fold.querySelector('.character__avatar');
  const bubble = fold.querySelector('.character__bubble');

  if (bubble) gsap.set(bubble, { autoAlpha: 0, y: 20 });

  function arrive() {
    CharSystem.dim('bruna');
    CharSystem.summon('bruna', avatarEl, 130, () => {
      if (bubble) gsap.to(bubble, {
        autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out',
        onComplete: () => {
          const lis = list?.querySelectorAll('li');
          if (lis?.length) {
            gsap.to(lis, { opacity: 1, x: 0, duration: 0.5, stagger: 0.14, ease: 'power2.out' });
          }
        }
      });
    });
  }
  function depart() {
    if (bubble) gsap.to(bubble, { autoAlpha: 0, duration: 0.2 });
    gsap.delayedCall(0.12, () => {
      CharSystem.dismiss('bruna', avatarEl, { skipReturn: true });
      avatarEl.innerHTML = '';
    });

  }

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', end: 'bottom top',
    onEnter: arrive, onLeave: depart, onEnterBack: arrive, onLeaveBack: depart,
  });

  const list = document.getElementById('master-reasons-list');
  if (list) {
    list.innerHTML = '';
    const raisons = (sportData.master.top5_impacts_positifs_etudes?.raisons ?? []).slice(0, 3);
    raisons.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.raison;
      list.appendChild(li);
    });
    gsap.set(list.querySelectorAll('li'), { opacity: 0, x: -18 });
  }
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 11 — Slide depuis la droite + barres (CORRIGÉ)

   ═══════════════════════════════════════════════════════════════ */

function initFold11() {
  const fold = document.getElementById('fold-11');
  const fold10 = document.getElementById('fold-10');
  if (!fold || !fold10) return;

  const avatarEl = fold.querySelector('.character__avatar');
  const bubble = fold.querySelector('.character__bubble');
  const container = document.getElementById('master-impact-chart');
  const fold10Content = fold10.querySelectorAll('.fold__title, .character, .character__bubble');

  if (avatarEl) {
    avatarEl.innerHTML = avatarSVG('bruna', 110);
    gsap.set(avatarEl, { autoAlpha: 0 });
  }
  if (bubble) gsap.set(bubble, { autoAlpha: 0, x: -16 });

  const fills = [];
  const pcts = [];
  const values = [];

  if (container) {
    container.innerHTML = '';
    sportData.master.top5_impacts_positifs_etudes.raisons.forEach(item => {
      const row = document.createElement('div');
      row.className = 'hbar-chart__row';
      row.innerHTML = `
        <span class="hbar-chart__label">${item.raison}</span>
        <div class="hbar-chart__track"><div class="hbar-chart__fill"></div></div>
        <span class="hbar-chart__value">${item.tres_important_pct}%</span>`;
      container.appendChild(row);
      const fill = row.querySelector('.hbar-chart__fill');
      const value = row.querySelector('.hbar-chart__value');
      gsap.set(fill, { width: '0%' });
      gsap.set(value, { autoAlpha: 0 });
      fills.push(fill);
      values.push(value);
      pcts.push(item.tres_important_pct);
    });
  }

  gsap.set(fold, {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 10, xPercent: 100, autoAlpha: 1,
  });

  const tl = gsap.timeline({ paused: true });

  /* Phase 1 : slide depuis la droite */
  tl.to(fold, { xPercent: 0, duration: 1, ease: 'power2.inOut' }, 0);

  /* Phase 2 : avatar + bulle */
  tl.to(avatarEl, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 1.0);
  tl.to(bubble, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 1.25);

  /* Phase 3 : barres une par une */
  fills.forEach((fill, i) => {
    tl.to(fill, { width: `${pcts[i]}%`, duration: 0.3, ease: 'power2.out' }, 1.65 + i * 0.7);
    tl.to(values[i], { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 1.65 + i * 0.7);
  });

  /* Phase 4 : pause pour lire */
  tl.to({}, { duration: 0.8 });

  /* Phase 5 : cache le titre Master + transition fond + disparition fold-11 */
  tl.to(fold10Content, { autoAlpha: 0, duration: 0.3, ease: 'power2.inOut' });
  tl.to(fold10, { backgroundColor: '#F3F0E9', duration: 0.4, ease: 'power2.inOut' }, '<');
  tl.to(fold, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, '<0.2');

  ScrollTrigger.create({
    trigger: fold10,
    start: 'bottom bottom',
    end: '+=400%',
    pin: true,
    scrub: 1.2,
    animation: tl,

    onEnter: () => CharSystem.dim('bruna'),
    onEnterBack: () => CharSystem.dim('bruna'),

    onLeave: () => {
      gsap.set(fold10, { autoAlpha: 0 });
      const fold12 = document.getElementById('fold-12');
      if (fold12) window.scrollTo({ top: fold12.offsetTop, behavior: 'instant' });
      gsap.delayedCall(0.05, () => {
        gsap.set(fold10, { autoAlpha: 1, backgroundColor: '' });
        fold10Content.forEach(el => gsap.set(el, { autoAlpha: 1 }));
      });
      CharSystem.undim('bruna');
    },

    onLeaveBack: () => {
      gsap.set(fold10, { backgroundColor: '' });
      fold10Content.forEach(el => gsap.set(el, { autoAlpha: 1 }));
      gsap.set(fold, {
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 10, xPercent: 100, autoAlpha: 1,
      });
      if (bubble) gsap.set(bubble, { autoAlpha: 0, x: -16 });
      if (avatarEl) {
        avatarEl.innerHTML = avatarSVG('bruna', 110);
        gsap.set(avatarEl, { autoAlpha: 0 });
      }
      fills.forEach(f => gsap.set(f, { width: '0%' }));
      values.forEach(v => gsap.set(v, { autoAlpha: 0 }));
      CharSystem.dim('bruna');
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 12 — Carte Suisse Romande avec cantons réels (D3 + GeoJSON)
   Remplace l'ancienne initFold12 dans index.js
   ═══════════════════════════════════════════════════════════════ */

function initFold12() {
  const fold = document.getElementById('fold-12');
  if (!fold) return;

  const unis = [
    { name: 'Univ. Genève', lon: 6.050, lat: 46.180, tres_actifs: 56.7 },
    { name: 'EPFL', lon: 6.420, lat: 46.580, tres_actifs: 67.3 },
    { name: 'Univ. Lausanne', lon: 6.720, lat: 46.440, tres_actifs: 61.3 },
    { name: 'Univ. Neuchâtel', lon: 6.870, lat: 47.050, tres_actifs: 64.7 },
    { name: 'Univ. Fribourg', lon: 7.220, lat: 46.750, tres_actifs: 59.8 },
  ];

  const mapC = document.getElementById('map-switzerland');
  if (!mapC) return;

  /* Cacher le tooltip */
  const tooltip = document.getElementById('map-tooltip');
  if (tooltip) tooltip.hidden = true;

  const W = mapC.clientWidth || 620;
  const H = 420;

  const svg = d3.select(mapC).append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%')
    .attr('height', H)
    .attr('class', 'map-svg');

  /* ── IDs cantons romands (KTNR swisstopo) ── */
  const ROMANDY_IDS = new Set([2, 10, 22, 23, 24, 25, 26]);
  const CANTON_ABBR = { 2: 'BE', 10: 'FR', 22: 'VD', 23: 'VS', 24: 'NE', 25: 'GE', 26: 'JU' };

  const allCantons = topojson.feature(topoData, topoData.objects.cantons);
  const allLakes = topojson.feature(topoData, topoData.objects.lakes);

  const romandyGeo = {
    type: 'FeatureCollection',
    features: allCantons.features.filter(f => ROMANDY_IDS.has(f.id ?? f.properties?.id)),
  };

  /* ── Projection ── */
  const proj = d3.geoMercator()
    .fitExtent([[24, 24], [W - 24, H - 24]], romandyGeo);
  const geoPath = d3.geoPath().projection(proj);

  /* ── Defs ── */
  const defs = svg.append('defs');

  const bgGrad = defs.append('linearGradient')
    .attr('id', 'mapBg12').attr('x1', '0%').attr('y1', '0%')
    .attr('x2', '100%').attr('y2', '100%');
  bgGrad.append('stop').attr('offset', '0%').attr('stop-color', '#edeae2');
  bgGrad.append('stop').attr('offset', '100%').attr('stop-color', '#e2dfd7');

  const flt = defs.append('filter').attr('id', 'mapShadow12')
    .attr('x', '-8%').attr('y', '-8%').attr('width', '116%').attr('height', '116%');
  flt.append('feDropShadow')
    .attr('dx', '0').attr('dy', '6').attr('stdDeviation', '12')
    .attr('flood-color', 'rgba(0,0,0,0.16)');

  defs.append('clipPath').attr('id', 'mapClip12')
    .append('rect').attr('width', W).attr('height', H).attr('rx', 18).attr('ry', 18);

  /* ── Fond ── */
  svg.append('rect').attr('width', W).attr('height', H)
    .attr('fill', 'url(#mapBg12)').attr('rx', 18)
    .attr('filter', 'url(#mapShadow12)');

  const mapGrp = svg.append('g').attr('clip-path', 'url(#mapClip12)');
  mapGrp.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#mapBg12)');

  /* ── Cantons ── */
  mapGrp.selectAll('path.canton')
    .data(romandyGeo.features)
    .join('path')
    .attr('class', 'canton')
    .attr('d', geoPath)
    .attr('fill', '#d9d1da')
    .attr('stroke', 'rgba(255,255,255,0.9)')
    .attr('stroke-width', 1.8)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round');

  /* ── Lacs ── */
  const bbox = geoPath.bounds(romandyGeo);
  const romandyLakes = {
    type: 'FeatureCollection',
    features: allLakes.features.filter(f => {
      const b = geoPath.bounds(f);
      const cx = (b[0][0] + b[1][0]) / 2;
      const cy = (b[0][1] + b[1][1]) / 2;
      return cx > bbox[0][0] && cx < bbox[1][0]
        && cy > bbox[0][1] && cy < bbox[1][1];
    }),
  };

  mapGrp.selectAll('path.lake')
    .data(romandyLakes.features)
    .join('path')
    .attr('class', 'lake')
    .attr('d', geoPath)
    .attr('fill', '#b0cde6')
    .attr('stroke', '#8ab4d4')
    .attr('stroke-width', 0.8)
    .attr('opacity', 0.9);

  /* ── Labels cantons ── */
  romandyGeo.features.forEach(f => {
    const id = f.id ?? f.properties?.id;
    const abbr = CANTON_ABBR[id] ?? '';
    const [cx, cy] = geoPath.centroid(f);
    if (isNaN(cx)) return;
    mapGrp.append('text')
      .attr('x', cx).attr('y', cy)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', "'Bricolage Grotesque', sans-serif")
      .attr('font-size', abbr === 'VS' ? '12px' : '9px')
      .attr('font-weight', '800')
      .attr('fill', 'rgba(255,255,255,0.68)')
      .attr('letter-spacing', '0.1em')
      .attr('pointer-events', 'none')
      .text(abbr);
  });

  /* ── Bulles proportionnelles ── */
  const radiusScale = d3.scaleSqrt()
    .domain([0, 100])
    .range([0, 38]);

  const pg = svg.append('g').attr('class', 'map-points');

  unis.forEach((uni, i) => {
    const [px, py] = proj([uni.lon, uni.lat]);
    const r = radiusScale(uni.tres_actifs);
    const g = pg.append('g').attr('transform', `translate(${px},${py})`);

    /* Halo pulsant */
    const halo = g.append('circle')
      .attr('r', r).attr('fill', C.green).attr('opacity', 0.12);
    gsap.to(halo.node(), {
      r: r + 10, opacity: 0,
      duration: 1.8, repeat: -1, ease: 'power2.out', delay: i * 0.35,
    });

    /* Cercle principal */
    g.append('circle')
      .attr('r', r)
      .attr('fill', C.green)
      .attr('opacity', 0.85)
      .attr('stroke', 'white')
      .attr('stroke-width', 2.5);

    /* Pourcentage centré — taille proportionnelle au cercle */
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', "'Bricolage Grotesque', sans-serif")
      .attr('font-size', `${Math.max(10, r * 0.55)}px`)
      .attr('font-weight', '800')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .text(uni.tres_actifs + '%');

    /* Nom en dessous du cercle */
    g.append('text')
      .attr('y', r + 13)
      .attr('text-anchor', 'middle')
      .attr('font-family', "'Bricolage Grotesque', sans-serif")
      .attr('font-size', '10px')
      .attr('font-weight', '800')
      .attr('fill', '#1a1a1a')
      .attr('pointer-events', 'none')
      .text(uni.name);
  });

  /* ── Animations scroll ── */
  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', once: true,
    onEnter: () => {
      gsap.from(mapGrp.selectAll('path').nodes(), {
        opacity: 0, duration: 0.9,
        stagger: { each: 0.04, from: 'start' },
        ease: 'power2.out',
      });
      gsap.from(pg.selectAll('g').nodes(), {
        scale: 0, opacity: 0, duration: 0.7,
        stagger: 0.12, delay: 0.6,
        ease: 'back.out(1.8)',
        transformOrigin: 'center center',
      });
    },
  });

  gsap.from(
    [fold.querySelector('.fold__title'), fold.querySelector('.fold__instruction')],
    {
      opacity: 0, y: 26, duration: 0.75, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: fold, start: 'top 62%' },
    }
  );
}


/* ═══════════════════════════════════════════════════════════════
   FOLD 13 — Biais
   ═══════════════════════════════════════════════════════════════ */
function initFold13() {
  const fold = document.getElementById('fold-13');
  if (!fold) return;

  gsap.from(fold.querySelector('.bias-block'), {
    opacity: 0, scale: 0.84, y: 36, duration: 0.9, ease: 'back.out(2)',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });

  gsap.to(fold.querySelector('.bias-block__icon'), {
    scale: 1.15, rotate: -5, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut',
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 14 — Évolution globale (line chart D3)
   ═══════════════════════════════════════════════════════════════ */
function initFold14() {
  const fold = document.getElementById('fold-14');
  if (!fold) return;

  const container = document.getElementById('chart-global');
  if (!container) return;

  const data = sportData.evolution_temporelle_2010_2025.tous_etudiants_evolution;
  const W = container.clientWidth || 600;
  const H = 260;
  const m = { top: 24, right: 32, bottom: 36, left: 52 };
  const iW = W - m.left - m.right;
  const iH = H - m.top - m.bottom;

  const svg = d3.select(container).append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%').attr('height', H);

  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);
  const x = d3.scaleLinear().domain([2010, 2025]).range([0, iW]);
  const y = d3.scaleLinear().domain([0, 100]).range([iH, 0]);

  g.append('g').attr('transform', `translate(0,${iH})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(4))
    .attr('class', 'chart-axis');
  g.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '%'))
    .attr('class', 'chart-axis');

  g.append('g').attr('class', 'grid')
    .call(d3.axisLeft(y).ticks(5).tickSize(-iW).tickFormat(''))
    .selectAll('line').style('stroke', 'rgba(0,0,0,0.05)').style('stroke-dasharray', '4 4');
  g.select('.grid .domain').remove();

  const area = d3.area()
    .x(d => x(d.annee)).y0(iH).y1(d => y(d.tres_actifs_pct))
    .curve(d3.curveCatmullRom.alpha(0.5));
  g.append('path').datum(data)
    .attr('fill', C.louis).attr('opacity', 0.07).attr('d', area);

  const line = d3.line()
    .x(d => x(d.annee)).y(d => y(d.tres_actifs_pct))
    .curve(d3.curveCatmullRom.alpha(0.5));
  const path = g.append('path').datum(data)
    .attr('fill', 'none').attr('stroke', C.louis)
    .attr('stroke-width', 3).attr('stroke-linecap', 'round').attr('d', line);

  const totalLen = path.node().getTotalLength();
  path.attr('stroke-dasharray', totalLen).attr('stroke-dashoffset', totalLen);

  /* ── Mesure longueur réelle jusqu'à x(2020) ── */
  const target2020X = x(2020) + m.left;
  let len2020 = 0;
  const STEPS = 1000;
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * totalLen;
    const pt = path.node().getPointAtLength(t);
    if (pt.x >= target2020X) {
      len2020 = t;
      break;
    }
  }
  const LINE_DURATION = 1.6;
  const delay2020 = LINE_DURATION * (len2020 / totalLen);

  /* ── Points + labels ── */
  ScrollTrigger.create({
    trigger: container, start: 'top 74%', once: true,
    onEnter: () => {
      gsap.to(path.node(), { strokeDashoffset: 0, duration: LINE_DURATION, ease: 'power2.out' });
      data.forEach((d, i) => {
        const dot = g.append('circle')
          .attr('cx', x(d.annee)).attr('cy', y(d.tres_actifs_pct))
          .attr('r', 6).attr('fill', C.louis)
          .attr('stroke', 'white').attr('stroke-width', 2.5).style('opacity', 0);
        g.append('text').attr('class', 'chart-dot-label')
          .attr('x', x(d.annee)).attr('y', y(d.tres_actifs_pct) - 13)
          .attr('text-anchor', 'middle').text(`${d.tres_actifs_pct}%`).style('opacity', 0)
          .call(el => gsap.to(el.node(), { opacity: 1, duration: 0.3, delay: 0.6 + i * 0.5 }));
        gsap.to(dot.node(), { opacity: 1, duration: 0.35, delay: 0.5 + i * 0.5 });
      });
    },
  });

  /* ══════════════════════════════════════════════════
     VIRUS COVID — verts
  ══════════════════════════════════════════════════ */
  function virusSVG(size = 48, color = C.green) {
    const r = size / 2;
    const spikes = 8;
    const spikeLen = size * 0.28;
    const ballR = size * 0.12;
    let spikePaths = '';
    let ballCircles = '';
    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2;
      const x1 = Math.cos(angle) * r;
      const y1 = Math.sin(angle) * r;
      const x2 = Math.cos(angle) * (r + spikeLen);
      const y2 = Math.sin(angle) * (r + spikeLen);
      spikePaths += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
        stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
      ballCircles += `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="${ballR.toFixed(1)}" fill="${color}"/>`;
    }
    const total = size + spikeLen * 2 + ballR * 2;
    const half = total / 2;
    return `<svg width="${total}" height="${total}" viewBox="${-half} ${-half} ${total} ${total}"
      xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible">
      <circle cx="0" cy="0" r="${r}" fill="${color}" opacity="0.9"/>
      ${spikePaths}
      ${ballCircles}
      <circle cx="${(-r * 0.3).toFixed(1)}" cy="${(-r * 0.3).toFixed(1)}" r="${(r * 0.22).toFixed(1)}"
        fill="white" opacity="0.25"/>
    </svg>`;
  }

  container.style.position = 'relative';

  const covidOverlay = document.createElement('div');
  covidOverlay.className = 'covid-overlay';
  container.appendChild(covidOverlay);

  const VIRUS_CONFIGS = [
    { x: 52, y: 10,  size: 52, delay: 0,    rotation: 15  },
    { x: 44, y: 55,  size: 38, delay: 0.15, rotation: -20 },
    { x: 62, y: 40,  size: 44, delay: 0.08, rotation: 30  },
    { x: 36, y: 20,  size: 30, delay: 0.25, rotation: -10 },
    { x: 70, y: 15,  size: 36, delay: 0.18, rotation: 45  },
    { x: 48, y: 75,  size: 28, delay: 0.3,  rotation: -35 },
    { x: 58, y: 68,  size: 42, delay: 0.22, rotation: 20  },
  ];

  const virusEls = [];
  VIRUS_CONFIGS.forEach(cfg => {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      position: absolute;
      left: ${cfg.x}%;
      top: ${cfg.y}%;
      transform: translate(-50%, -50%) rotate(${cfg.rotation}deg) scale(0);
      opacity: 0;
      will-change: transform, opacity;
    `;
    wrap.innerHTML = virusSVG(cfg.size, C.green);
    covidOverlay.appendChild(wrap);
    virusEls.push({ el: wrap, cfg });
  });

  const covidText = document.createElement('div');
  covidText.className = 'covid-hypothesis';
  covidText.innerHTML = `
    <span class="covid-hypothesis__icon">🦠</span>
    <p>
      <strong>Hypothèse :</strong> le confinement COVID-19 (2020) aurait poussé de nombreux étudiant·e·s
      à (re)prendre une activité physique, expliquant le pic observé cette année-là.
    </p>
  `;
  gsap.set(covidText, { opacity: 0, y: 14 });
  fold.appendChild(covidText);

  let covidTriggered = false;
  let delayedCallRef = null;

  function resetCovid() {
    covidTriggered = false;
    if (delayedCallRef) { delayedCallRef.kill(); delayedCallRef = null; }
    virusEls.forEach(({ el, cfg }) => {
      gsap.killTweensOf(el);
      gsap.set(el, { opacity: 0, scale: 0, y: 0 });
      el.style.transform = `translate(-50%, -50%) rotate(${cfg.rotation}deg) scale(0)`;
    });
    gsap.set(covidText, { opacity: 0, y: 14 });
  }

  ScrollTrigger.create({
    trigger: container,
    start: 'top 74%',
    onEnter: () => {
      if (covidTriggered) return;
      delayedCallRef = gsap.delayedCall(delay2020, () => {
        covidTriggered = true;

        virusEls.forEach(({ el, cfg }) => {
          gsap.to(el, {
            opacity: 1,
            duration: 0.5,
            delay: cfg.delay,
            ease: 'power2.out',
          });
          gsap.to(el, {
            scale: 1,
            duration: 0.6,
            delay: cfg.delay,
            ease: 'back.out(2)',
            onComplete: () => {
              gsap.to(el, {
                rotate: cfg.rotation + 360,
                duration: 8 + Math.random() * 6,
                repeat: -1,
                ease: 'none',
              });
              gsap.to(el, {
                y: -6,
                duration: 1.8 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 0.5,
              });
            },
          });
        });

        gsap.to(covidText, {
          opacity: 1, y: 0,
          duration: 0.7,
          delay: 0.5,
          ease: 'power2.out',
        });
      });
    },
    onLeaveBack: () => resetCovid(),
  });

  /* ── Louis marchant ── */
  const charWrap = document.createElement('div');
  charWrap.className = 'evolution-character';
  charWrap.innerHTML = avatarSVG('louis', 56);
  container.appendChild(charWrap);

  gsap.to(charWrap, {
    x: iW * 0.78, ease: 'none',
    scrollTrigger: { trigger: fold, start: 'top center', end: 'bottom center', scrub: 0.6 },
  });

  let walkPhase = 0;
  function louisWalk() {
    walkPhase = (walkPhase + 1) % 2;
    charWrap.innerHTML = avatarSVG('louis', 56);
    gsap.fromTo(charWrap,
      { y: 0 },
      { y: walkPhase === 0 ? -3 : 0, duration: 0.4, ease: 'sine.inOut', onComplete: louisWalk }
    );
  }
  louisWalk();

  gsap.from(fold.querySelector('.fold__subtitle'), {
    opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', end: 'bottom top',
    onEnter: () => CharSystem.dim('louis'),
    onLeave: () => CharSystem.undim('louis'),
    onEnterBack: () => CharSystem.dim('louis'),
    onLeaveBack: () => CharSystem.undim('louis'),
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 15 — Évolution par niveau (4 courbes)
   ═══════════════════════════════════════════════════════════════ */
function initFold15() {
  const fold = document.getElementById('fold-15');
  if (!fold) return;

  const container = document.getElementById('chart-by-level');
  if (!container) return;

  const W = container.clientWidth || 600;
  const H = 300;
  const m = { top: 24, right: 32, bottom: 36, left: 52 };
  const iW = W - m.left - m.right;
  const iH = H - m.top - m.bottom;

  const svg = d3.select(container).append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%').attr('height', H);
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  const x = d3.scaleLinear().domain([2010, 2025]).range([0, iW]);
  const y = d3.scaleLinear().domain([0, 100]).range([iH, 0]);
  // const y = d3.scaleLinear().domain([40, 72]).range([iH, 0]);

  g.append('g').attr('transform', `translate(0,${iH})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(4))
    .attr('class', 'chart-axis');
  g.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '%'))
    .attr('class', 'chart-axis');

  g.append('g').attr('class', 'grid')
    .call(d3.axisLeft(y).ticks(5).tickSize(-iW).tickFormat(''))
    .selectAll('line').style('stroke', 'rgba(255,255,255,0.06)').style('stroke-dasharray', '4 4');
  g.select('.grid .domain').remove();

  const levels = [
    { key: 'master', color: C.bruna, data: [{ a: 2010, v: 49 }, { a: 2015, v: 48 }, { a: 2020, v: 58 }, { a: 2025, v: 52 }] },
    { key: 'bachelor', color: C.thomas, data: [{ a: 2010, v: 47 }, { a: 2015, v: 46 }, { a: 2020, v: 59 }, { a: 2025, v: 54 }] },
    { key: 'gymnase', color: C.louis, data: [{ a: 2010, v: 60 }, { a: 2015, v: 62 }, { a: 2020, v: 64 }, { a: 2025, v: 66.7 }] },
    { key: 'apprentissage', color: C.chloe, data: [{ a: 2010, v: 58 }, { a: 2015, v: 60 }, { a: 2020, v: 63 }, { a: 2025, v: 66.7 }] },
  ];

  const lineGen = d3.line().x(d => x(d.a)).y(d => y(d.v)).curve(d3.curveCatmullRom.alpha(0.5));

  levels.forEach((lvl, i) => {
    const path = g.append('path').datum(lvl.data)
      .attr('fill', 'none').attr('stroke', lvl.color)
      .attr('stroke-width', 2.8).attr('stroke-linecap', 'round').attr('d', lineGen);
    const len = path.node().getTotalLength();
    path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len);

    ScrollTrigger.create({
      trigger: container, start: 'top 74%', once: true,
      onEnter: () => gsap.to(path.node(), {
        strokeDashoffset: 0, duration: 2.4, delay: i * 0.3, ease: 'power2.out',
      }),
    });

    const last = lvl.data[lvl.data.length - 1];
    g.append('circle')
      .attr('cx', x(last.a)).attr('cy', y(last.v))
      .attr('r', 5).attr('fill', lvl.color).attr('stroke', C.bg_dark).attr('stroke-width', 2);
    g.append('text').attr('class', 'chart-dot-label')
      .attr('x', x(last.a) + 8).attr('y', y(last.v) + 4)
      .attr('fill', lvl.color).text(last.v + '%');
  });

  const cr = document.createElement('div');
  cr.className = 'chart-characters-row';
  ['louis', 'chloe', 'thomas', 'bruna'].forEach(n => {
    const s = document.createElement('span');
    s.innerHTML = avatarSVG(n, 52);
    cr.appendChild(s);
  });
  container.style.position = 'relative';
  container.appendChild(cr);

  gsap.from(fold.querySelector('.fold__subtitle'), {
    opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', end: 'bottom top',
    onEnter: () => CharSystem.ORDER.forEach(name => CharSystem.dim(name)),
    onLeave: () => CharSystem.ORDER.forEach(name => CharSystem.undim(name)),
    onEnterBack: () => CharSystem.ORDER.forEach(name => CharSystem.dim(name)),
    onLeaveBack: () => CharSystem.ORDER.forEach(name => CharSystem.undim(name)),
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLDS 16-17 — Débat
   ═══════════════════════════════════════════════════════════════ */
function initDebate() {
  [
    {
      id: 'fold-16',
      leftName: 'louis',
      rightName: 'bruna',
      sequence: ['left', 'right', 'left'],
    },
    {
      id: 'fold-17',
      leftName: 'chloe',
      rightName: 'thomas',
      sequence: ['right', 'left'],
    },
  ].forEach(({ id, leftName, rightName, sequence }) => {
    const fold = document.getElementById(id);
    if (!fold) return;

    /* ── Récupérer les bulles originales et leurs textes ── */
    const scene = fold.querySelector('.debate-scene');
    const originalBubbles = [...scene.querySelectorAll('.debate-bubble')];
    const bubbleData = originalBubbles.map((b, i) => ({
      text: b.textContent.trim(),
      className: b.className,
      side: sequence[i] ?? 'left',
    }));

    /* ── Vider la scène et reconstruire avec avatar + bulle par ligne ── */
    scene.innerHTML = '';

    const rows = []; /* { rowEl, avatarEl, bubbleEl, side } */
    const nameMap = { left: leftName, right: rightName };

    bubbleData.forEach(({ text, className, side }) => {
      const name = nameMap[side] ?? leftName;

      const row = document.createElement('div');
      row.className = `debate-row debate-row--${side}`;

      const av = document.createElement('div');
      av.className = 'debate-row__avatar';
      av.innerHTML = avatarSVG(name, 52);

      const bub = document.createElement('div');
      bub.className = className; /* conserve debate-bubble--left/right/etc. */
      bub.textContent = text;

      /* Avatar toujours du côté extérieur de la conversation
         gauche → avatar | bulle
         droite → bulle | avatar  (flex-direction: row-reverse en CSS,
                                    donc l'avatar reste visuellement à droite) */
      row.appendChild(av);
      row.appendChild(bub);

      scene.appendChild(row);

      /* Tout caché au départ */
      gsap.set(row, { autoAlpha: 0 });
      gsap.set(bub, { scale: 0.6, transformOrigin: side === 'left' ? 'bottom left' : 'bottom right' });

      rows.push({ rowEl: row, avatarEl: av, bubbleEl: bub, side });
    });

    /* ── Lock scroll ── */
    let lockedAt = null;
    let seqDone = false;
    let seqRunning = false;

    function onScroll() {
      if (lockedAt === null) return;
      window.scrollTo({ top: lockedAt, behavior: 'instant' });
    }

    function onWheel(e) { e.preventDefault(); }
    function onTouch(e) { e.preventDefault(); }

    function lockScroll() {
      lockedAt = fold.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: lockedAt, behavior: 'instant' });
      /* Bloquer le scroll natif ET l'effet élastique */
      window.addEventListener('scroll', onScroll);
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchmove', onTouch, { passive: false });
    }

    function unlockScroll() {
      lockedAt = null;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouch);
    }

    /* ── Séquence messages ── */
    let seqTimeline = null;

    function playSequence() {
      if (seqRunning || seqDone) return;
      seqRunning = true;

      seqTimeline = gsap.timeline({
        onComplete: () => {
          seqDone = true;
          seqRunning = false;
          unlockScroll();
        },
      });

      /* Délai initial */
      seqTimeline.to({}, { duration: 0.5 });

      rows.forEach(({ rowEl, bubbleEl }, i) => {
        /* La ligne apparaît (avatar + bulle ensemble) */
        seqTimeline.to(rowEl, { autoAlpha: 1, duration: 0.2, ease: 'power2.out' });

        /* La bulle bounce */
        seqTimeline.to(bubbleEl, {
          scale: 1,
          duration: 0.55,
          ease: 'back.out(2.8)',
        }, '<');

        /* Pause entre messages */
        if (i < rows.length - 1) {
          seqTimeline.to({}, { duration: 0.85 });
        }
      });

      /* Petite pause finale avant de délocker */
      seqTimeline.to({}, { duration: 0.6 });
    }

    function resetSequence() {
      if (seqTimeline) { seqTimeline.kill(); seqTimeline = null; }
      seqDone = false;
      seqRunning = false;
      rows.forEach(({ rowEl, bubbleEl, side }) => {
        gsap.set(rowEl, { autoAlpha: 0 });
        gsap.set(bubbleEl, {
          scale: 0.6,
          transformOrigin: side === 'left' ? 'bottom left' : 'bottom right',
        });
      });
    }

    /* ── ScrollTrigger : arrive / depart ── */
    function arrive() {
      playSequence();
    }

    function depart() {
      unlockScroll();
      resetSequence();
    }

    /* Déclenche la séquence quand la fold est visible */
    ScrollTrigger.create({
      trigger: fold,
      start: 'top 62%',
      end: 'bottom top',
      onEnter: arrive,
      onLeave: depart,
      onEnterBack: arrive,
      onLeaveBack: depart,
    });

    /* Lock quand la fold est exactement en haut du viewport */
    ScrollTrigger.create({
      trigger: fold,
      start: 'top top',
      onEnter: () => { if (!seqDone) lockScroll(); },
      onEnterBack: () => { seqDone = false; lockScroll(); resetSequence(); gsap.delayedCall(0.1, playSequence); },
      onLeaveBack: () => { unlockScroll(); },
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 18 — Conclusion
   ═══════════════════════════════════════════════════════════════ */
function initFold18() {
  const fold = document.getElementById('fold-18');
  if (!fold) return;

  const wrap = document.createElement('div');
  wrap.className = 'conclusion-characters';
  ['louis', 'chloe', 'thomas', 'bruna'].forEach(n => {
    const s = document.createElement('span');
    s.className = 'conclusion-char';
    s.innerHTML = avatarSVG(n, 90);
    wrap.appendChild(s);
  });
  fold.insertBefore(wrap, fold.querySelector('.conclusion__text'));

  const chars = wrap.querySelectorAll('.conclusion-char');
  const text = fold.querySelector('.conclusion__text');
  gsap.set(chars, { opacity: 0, scale: 0.4, y: 50 });
  gsap.set(text, { opacity: 0, y: 32 });

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', once: true,
    onEnter: () => {
      gsap.to(chars, {
        opacity: 1, scale: 1, y: 0,
        duration: 0.85, stagger: 0.18, ease: 'back.out(2.4)',
        onComplete: () => gsap.to(text, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }),
      });
    },
  });


  chars.forEach((c, i) => {
    gsap.to(c, {
      y: -10, duration: 2 + i * 0.3,
      repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.4,
    });
  });

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%',
    onEnter: () => {
      CharSystem.ORDER.forEach(name => CharSystem.dim(name));
      gsap.delayedCall(1.5, () => {
        CharSystem.ORDER.forEach(name => CharSystem.dim(name));
      });
    },
    onEnterBack: () => {
      CharSystem.ORDER.forEach(name => CharSystem.dim(name));
    },
    onLeaveBack: () => {
      CharSystem.ORDER.forEach(name => CharSystem.undim(name));
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   INIT GLOBAL
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  injectStats();
  CharSystem.init();
  initScrollProgress();
  initSeriesLabel();

  initFold1();
  initFold2();
  initFold3();
  initFold4();
  initFold5();
  initFold6();
  initFold7();
  initFold8();
  initFold9();
  initFold10();
  initFold11();
  initFold12();
  initFold13();
  initFold14();
  initFold15();
  initDebate();
  initFold18();

  window.addEventListener('load', () => ScrollTrigger.refresh());
});