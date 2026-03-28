import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import * as d3 from 'd3';
import sportData from '../data/data-sport.json';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ═══════════════════════════════════════════════════════════════
   PALETTE
   ═══════════════════════════════════════════════════════════════ */
const C = {
  louis: '#3473F0',
  chloe: '#EF3F3F',
  thomas: '#0DBF80',
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
    el.textContent = typeof val === 'number'
      ? (Number.isInteger(val) ? val + '%' : val.toFixed(1) + '%')
      : val;
  });
}

/* ═══════════════════════════════════════════════════════════════
   PERSONNAGES — SVG ILLUSTRÉS
   Viewbox 0 0 110 200 — style flat illustration
   ═══════════════════════════════════════════════════════════════ */

/* Couleurs de peau et cheveux par personnage */
const CHARS = {
  louis: { skin: '#F5C4A0', hair: '#2C1A0E', accent: C.louis, dark: '#1A56CC' },
  chloe: { skin: '#F8D4B0', hair: '#1A0A05', accent: C.chloe, dark: '#C42020' },
  thomas: { skin: '#F0BB8A', hair: '#4A3728', accent: C.thomas, dark: '#069A65' },
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
   PICTOGRAMME — stylisé
   ═══════════════════════════════════════════════════════════════ */
function pictoSVG(color = '#ccc', isHero = false, size = 32) {
  const body = isHero ? '#F5A623' : color;
  const glow = isHero
    ? `<circle cx="16" cy="16" r="15" fill="#F5A623" opacity=".2"/>
       <circle cx="16" cy="7" r="6.5" fill="#F5A623" stroke="white" stroke-width="1.5"/>
       <path d="M6 30 C6 21 26 21 26 30" fill="#F5A623"/>
       <circle cx="16" cy="4" r="2" fill="white"/>
       <line x1="16" y1="1" x2="16" y2="6" stroke="white" stroke-width="1.5"/>`
    : `<circle cx="16" cy="7" r="6" fill="${body}" opacity=".9"/>
       <path d="M7 30 C7 22 25 22 25 30" fill="${body}" opacity=".9"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">${glow}</svg>`;
}

/* ═══════════════════════════════════════════════════════════════
   GRILLE DE PICTOGRAMMES
   ═══════════════════════════════════════════════════════════════ */
function buildPictoGrid(container, { total = 10, active = 5, color = '#888', heroIndex = -1, label = '', pct = null }) {
  container.innerHTML = '';

  if (label) {
    const lbl = document.createElement('p');
    lbl.className = 'picto-grid__label';
    lbl.innerHTML = `<span>${label}</span>${pct !== null ? `<strong>${pct}%</strong>` : ''}`;
    container.appendChild(lbl);
  }

  const wrap = document.createElement('div');
  wrap.className = 'picto-grid';
  container.appendChild(wrap);

  for (let i = 0; i < total; i++) {
    const span = document.createElement('span');
    span.className = 'picto-grid__item' + (i < active ? ' picto-grid__item--active' : '');
    span.innerHTML = pictoSVG(i < active ? color : C.muted, i === heroIndex);
    gsap.set(span, { opacity: 0, y: 16, scale: 0.8 });
    wrap.appendChild(span);
  }

  ScrollTrigger.create({
    trigger: container, start: 'top 80%', once: true,
    onEnter: () => gsap.to(wrap.querySelectorAll('.picto-grid__item'), {
      opacity: 1, y: 0, scale: 1,
      duration: 0.5, stagger: 0.07, ease: 'back.out(2.5)',
    }),
  });
}

/* ═══════════════════════════════════════════════════════════════
   UI GLOBAUX
   ═══════════════════════════════════════════════════════════════ */
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
  const label = document.createElement('div');
  label.className = 'series-label';
  document.body.appendChild(label);

  [
    { id: 'fold-1', text: 'Série 1 · Introduction' },
    { id: 'fold-2', text: 'Série 2 · Gymnase & Apprentissage' },
    { id: 'fold-5', text: 'Quiz interactif' },
    { id: 'fold-7', text: 'Série 2 · Bachelor' },
    { id: 'fold-10', text: 'Série 2 · Master' },
    { id: 'fold-12', text: 'Série 3 · Par région' },
    { id: 'fold-14', text: 'Série 4 · Évolution temporelle' },
    { id: 'fold-16', text: 'Épilogue · Débat' },
  ].forEach(({ id, text }) => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top center', end: 'bottom center',
      onEnter: () => { label.textContent = text; label.classList.add('visible'); },
      onLeave: () => label.classList.remove('visible'),
      onEnterBack: () => { label.textContent = text; label.classList.add('visible'); },
      onLeaveBack: () => label.classList.remove('visible'),
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 1 — Intro protagonistes
   ═══════════════════════════════════════════════════════════════ */
function initFold1() {
  const fold = document.getElementById('fold-1');
  if (!fold) return;

  fold.querySelectorAll('.character__avatar').forEach(el => {
    const name = el.closest('[data-name]')?.dataset.name;
    if (name) el.innerHTML = avatarSVG(name, 130);
  });

  const chars = fold.querySelectorAll('.character');
  const subtitle = fold.querySelector('.fold__subtitle');

  gsap.set(chars, { opacity: 0, y: 80, scale: 0.88 });
  gsap.set(subtitle, { opacity: 0, y: 24 });

  ScrollTrigger.create({
    trigger: fold, start: 'top 55%', once: true,
    onEnter: () => {
      gsap.to(chars, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.9, stagger: 0.2, ease: 'power3.out',
        onComplete: () => gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
      });
    },
  });

  // Bulles respirent légèrement
  fold.querySelectorAll('.character__bubble').forEach((b, i) => {
    gsap.fromTo(b, { y: 0 }, {
      y: -4, duration: 2.4 + i * 0.5,
      repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.5,
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 2 — Stats Gymnase / Apprentissage
   ═══════════════════════════════════════════════════════════════ */
function initFold2() {
  const fold = document.getElementById('fold-2');
  if (!fold) return;

  // Ticker
  const wrap = document.createElement('div'); wrap.className = 'ticker-wrap';
  const tick = document.createElement('div'); tick.className = 'ticker';
  tick.innerHTML = ('GYMNASE · APPRENTISSAGE · SPORT & ÉTUDES · ').repeat(6);
  wrap.appendChild(tick);
  fold.insertBefore(wrap, fold.querySelector('.fold__title'));
  gsap.to(tick, { x: '-50%', duration: 20, repeat: -1, ease: 'none' });

  // Pictogrammes
  [
    { sel: '.stat-block--light .stat-block__pictogram', pct: sportData.gymnasiens.pratiquent_sport_regulier_pct, color: C.louis },
    { sel: '.stat-block--dark .stat-block__pictogram', pct: sportData.apprentis.pratiquent_sport_regulier_pct, color: C.chloe },
  ].forEach(({ sel, pct, color }) => {
    const container = fold.querySelector(sel);
    if (container) buildPictoGrid(container, { total: 10, active: Math.round(pct / 10), color, heroIndex: 0 });
  });

  // Compteurs animés
  fold.querySelectorAll('.stat-block__number').forEach(el => {
    const target = parseFloat(resolvePath(sportData, el.dataset.stat));
    if (isNaN(target)) return;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 84%', once: true,
      onEnter: () => gsap.to(obj, {
        val: target, duration: 1.9, ease: 'power2.out',
        onUpdate: () => { el.textContent = obj.val.toFixed(1) + '%'; },
      }),
    });
  });

  gsap.from(fold.querySelectorAll('.stat-block'), {
    opacity: 0, x: -55, duration: 1, stagger: 0.25, ease: 'power3.out',
    scrollTrigger: { trigger: fold.querySelector('.stats-split'), start: 'top 65%' },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 3 — Louis, 33% arrêtent
   ═══════════════════════════════════════════════════════════════ */
function initFold3() {
  const fold = document.getElementById('fold-3');
  if (!fold) return;

  const avatar = fold.querySelector('.character__avatar');
  if (avatar) avatar.innerHTML = avatarSVG('louis', 130);

  const char = fold.querySelector('.character');
  const bigNum = fold.querySelector('.big-stat__number');

  gsap.set(char, { x: 90, opacity: 0 });
  gsap.set(bigNum, { scale: 0.4, opacity: 0, rotation: -10 });

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', once: true,
    onEnter: () => {
      gsap.to(char, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
      gsap.to(bigNum, { scale: 1, opacity: 1, rotation: 0, duration: 1.1, delay: 0.4, ease: 'elastic.out(1.1, 0.5)' });
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 4 — Raisons arrêt gymnase
   ═══════════════════════════════════════════════════════════════ */
function initFold4() {
  const fold = document.getElementById('fold-4');
  if (!fold) return;

  const list = document.getElementById('gymnase-reasons-list');
  if (list) {
    sportData.gymnasiens.top3_raisons_arret.forEach(item => {
      const li = document.createElement('li');
      li.className = 'reasons-list__item';
      li.innerHTML = `<span class="reasons-list__rank">${item.rang}</span>${item.raison}`;
      gsap.set(li, { opacity: 0, x: -40 });
      list.appendChild(li);
    });
    ScrollTrigger.create({
      trigger: list, start: 'top 80%', once: true,
      onEnter: () => gsap.to(list.querySelectorAll('li'), {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
      }),
    });
  }

  gsap.from(fold.querySelector('.big-stat__number'), {
    scale: 0.5, opacity: 0, duration: 0.9, ease: 'back.out(2)',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 5 — Quiz slider
   ═══════════════════════════════════════════════════════════════ */
function initFold5() {
  const fold = document.getElementById('fold-5');
  if (!fold) return;

  const avatar = fold.querySelector('.character__avatar');
  if (avatar) avatar.innerHTML = avatarSVG('thomas', 130);

  gsap.from([fold.querySelector('.character'), fold.querySelector('.quiz-block')], {
    opacity: 0, y: 50, duration: 0.9, stagger: 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });

  const slider = document.getElementById('quiz-slider');
  const output = fold.querySelector('.quiz-block__output');
  const btn = fold.querySelector('.quiz-block__submit');
  const correct = sportData.bachelor.pratiquent_sport_regulier.source_quizz.pratiquent_regulier_pct;

  if (slider && output) {
    output.textContent = slider.value + '%';
    slider.addEventListener('input', () => {
      output.textContent = slider.value + '%';
      // Couleur slider en temps réel
      const diff = Math.abs(parseFloat(slider.value) - correct);
      const hue = diff < 10 ? '145' : diff < 20 ? '38' : '0';
      output.style.color = `hsl(${hue}, 80%, 42%)`;
    });
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const diff = Math.abs(parseFloat(slider.value) - correct);
      if (diff <= 8) {
        gsap.to(window, { scrollTo: { y: '#fold-6', offsetY: 0 }, duration: 1.1, ease: 'power2.inOut' });
      } else {
        const quiz = fold.querySelector('.quiz-block');
        gsap.timeline()
          .to(quiz, { x: -14, duration: 0.07 })
          .to(quiz, { x: 14, duration: 0.07 })
          .to(quiz, { x: -10, duration: 0.07 })
          .to(quiz, { x: 10, duration: 0.07 })
          .to(quiz, { x: 0, duration: 0.07 });

        let hint = fold.querySelector('.quiz-block__hint');
        if (!hint) {
          hint = document.createElement('p');
          hint.className = 'quiz-block__hint';
          quiz.appendChild(hint);
        }
        hint.textContent = diff > 22 ? 'Pas tout à fait… essaie encore !' : 'Tu y es presque !';
        gsap.fromTo(hint, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 6 — Révélation EXACT
   ═══════════════════════════════════════════════════════════════ */
function initFold6() {
  const fold = document.getElementById('fold-6');
  if (!fold) return;

  const pct = sportData.bachelor.pratiquent_sport_regulier.source_quizz.pratiquent_regulier_pct;
  const ticker = fold.querySelector('.reveal-banner__ticker');
  if (ticker) {
    ticker.innerHTML = (`${pct.toFixed(1)}% · `).repeat(16);
    gsap.to(ticker, { x: '-50%', duration: 9, repeat: -1, ease: 'none' });
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
   FOLD 7 — Raisons de continuer (bachelor, pictogrammes)
   ═══════════════════════════════════════════════════════════════ */
function initFold7() {
  const fold = document.getElementById('fold-7');
  if (!fold) return;

  const avatar = fold.querySelector('.character__avatar');
  if (avatar) avatar.innerHTML = avatarSVG('thomas', 130);

  gsap.from(fold.querySelector('.character'), {
    opacity: 0, x: -55, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });

  const container = document.getElementById('bachelor-reasons-pictogram');
  if (!container) return;

  sportData.bachelor.top5_raisons_pratique_quizz.slice(0, 3).forEach(item => {
    const div = document.createElement('div');
    div.className = 'reason-picto-block';
    buildPictoGrid(div, {
      total: 10, active: Math.round(item.pct / 10),
      color: C.thomas, heroIndex: 0, label: item.raison, pct: item.pct,
    });
    container.appendChild(div);
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 8 — Déclin bachelor
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
  if (pictoC) buildPictoGrid(pictoC, { total: 10, active: Math.round(dropoutPct / 10), color: C.accent, heroIndex: 3 });

  gsap.from(fold.querySelector('.fold__statement'), {
    opacity: 0, y: 36, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 9 — Bar chart raisons inactivité
   ═══════════════════════════════════════════════════════════════ */
function initFold9() {
  const fold = document.getElementById('fold-9');
  if (!fold) return;

  const container = document.getElementById('inactivite-bar-chart');
  if (!container) return;

  const data = sportData.inactivite_globale.top5_raisons_inactivite_2025;
  const maxPct = Math.max(...data.map(d => d.pct_2025));
  const colors = [C.accent, C.louis, C.thomas, C.bruna, C.chloe];

  data.forEach((item, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar-chart__bar';
    bar.innerHTML = `
      <div class="bar-chart__fill" style="background:${colors[i]}">
        <span class="bar-chart__value">${item.pct_2025}%</span>
      </div>
      <p class="bar-chart__label">${item.raison}</p>`;
    container.appendChild(bar);

    const fill = bar.querySelector('.bar-chart__fill');
    const h = (item.pct_2025 / maxPct) * 100;
    gsap.set(fill, { height: '0%' });
    ScrollTrigger.create({
      trigger: container, start: 'top 78%', once: true,
      onEnter: () => gsap.to(fill, { height: `${h}%`, duration: 1.4, delay: i * 0.1, ease: 'power3.out' }),
    });
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

  const avatar = fold.querySelector('.character__avatar');
  if (avatar) avatar.innerHTML = avatarSVG('bruna', 130);

  const list = document.getElementById('master-reasons-list');
  if (list) {
    sportData.master.top3_raisons_pratiques_logistiques.raisons.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.raison;
      gsap.set(li, { opacity: 0, x: -22 });
      list.appendChild(li);
    });
    ScrollTrigger.create({
      trigger: list, start: 'top 82%', once: true,
      onEnter: () => gsap.to(list.querySelectorAll('li'), {
        opacity: 1, x: 0, duration: 0.5, stagger: 0.14, ease: 'power2.out',
      }),
    });
  }

  gsap.from(fold.querySelector('.character'), {
    opacity: 0, y: 50, duration: 0.95, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 11 — Impacts positifs (jauges horizontales)
   ═══════════════════════════════════════════════════════════════ */
function initFold11() {
  const fold = document.getElementById('fold-11');
  if (!fold) return;

  const container = document.getElementById('master-impact-chart');
  if (!container) return;

  const fillColors = [C.bruna, '#A78BFA', '#7C3AED', '#6D28D9', '#5B21B6'];

  sportData.master.top5_impacts_positifs_etudes.raisons.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'hbar-chart__row';
    row.innerHTML = `
      <span class="hbar-chart__label">${item.raison}</span>
      <div class="hbar-chart__track"><div class="hbar-chart__fill" style="background:${fillColors[i]}"></div></div>
      <span class="hbar-chart__value" style="color:${fillColors[i]}">${item.tres_important_pct}%</span>`;
    container.appendChild(row);

    const fill = row.querySelector('.hbar-chart__fill');
    gsap.set(fill, { width: '0%' });
    ScrollTrigger.create({
      trigger: container, start: 'top 78%', once: true,
      onEnter: () => gsap.to(fill, {
        width: `${item.tres_important_pct}%`, duration: 1.3, delay: i * 0.13, ease: 'power3.out',
      }),
    });
  });

  gsap.from(fold.querySelector('.fold__subtitle'), {
    opacity: 0, y: 22, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOLD 12 — Carte Suisse Romande (D3)
   ═══════════════════════════════════════════════════════════════ */
function initFold12() {
  const fold = document.getElementById('fold-12');
  if (!fold) return;

  const unis = [
    { name: 'Université de Genève', lon: 6.147, lat: 46.198, tres_actifs: 56.7, part1x: 22 },
    { name: 'EPF Lausanne', lon: 6.566, lat: 46.519, tres_actifs: 67.3, part1x: 30 },
    { name: 'Université de Lausanne', lon: 6.581, lat: 46.524, tres_actifs: 61.3, part1x: 32 },
    { name: 'Université de Neuchâtel', lon: 6.931, lat: 46.994, tres_actifs: 64.7, part1x: 40 },
    { name: 'Université de Fribourg', lon: 7.161, lat: 46.806, tres_actifs: 59.8, part1x: 46 },
  ];

  const mapC = document.getElementById('map-switzerland');
  if (!mapC) return;

  const W = mapC.clientWidth || 620;
  const H = 380;

  const svg = d3.select(mapC).append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%').attr('height', H)
    .attr('class', 'map-svg');

  const proj = d3.geoMercator()
    .center([6.85, 46.65])
    .scale(W * 14)
    .translate([W / 2, H / 2]);

  // Fond carte
  const defs = svg.append('defs');
  const grad = defs.append('radialGradient').attr('id', 'mapGrad');
  grad.append('stop').attr('offset', '0%').attr('stop-color', '#E2DFD7');
  grad.append('stop').attr('offset', '100%').attr('stop-color', '#D4D0C8');
  svg.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#mapGrad)').attr('rx', 16);

  // Labels régions
  [
    { name: 'Léman', lon: 6.55, lat: 46.43 },
    { name: 'Jura', lon: 7.05, lat: 47.15 },
    { name: 'Valais', lon: 7.5, lat: 46.22 },
  ].forEach(r => {
    const [rx, ry] = proj([r.lon, r.lat]);
    svg.append('text').attr('x', rx).attr('y', ry)
      .attr('text-anchor', 'middle').attr('class', 'map-region-label').text(r.name);
  });

  const tooltip = document.getElementById('map-tooltip');
  const pg = svg.append('g').attr('class', 'map-points');

  unis.forEach((uni, i) => {
    const [px, py] = proj([uni.lon, uni.lat]);
    const g = pg.append('g').attr('transform', `translate(${px},${py})`).style('cursor', 'pointer');

    // Halo pulsant
    const halo = g.append('circle').attr('r', 12).attr('fill', C.accent).attr('opacity', 0.15);
    gsap.to(halo.node(), { r: 22, opacity: 0, duration: 1.8, repeat: -1, ease: 'power2.out', delay: i * 0.38 });

    g.append('circle').attr('r', 7).attr('fill', C.accent).attr('stroke', 'white').attr('stroke-width', 2.5);
    g.append('circle').attr('r', 2.5).attr('fill', 'white').attr('opacity', 0.8);

    // Label de pourcentage
    g.append('text').attr('y', -14)
      .attr('text-anchor', 'middle')
      .attr('font-family', "'Bricolage Grotesque', sans-serif")
      .attr('font-size', '10px').attr('font-weight', '800')
      .attr('fill', C.accent)
      .text(uni.tres_actifs + '%');

    g.on('mouseenter', (event) => {
      if (!tooltip) return;
      tooltip.hidden = false;
      tooltip.querySelector('.map-tooltip__name').textContent = uni.name;
      tooltip.querySelector('.map-tooltip__tres-actifs').textContent = `Très actifs : ${uni.tres_actifs}%`;
      tooltip.querySelector('.map-tooltip__participation').textContent = `Sport univ 1×/sem : ${uni.part1x}%`;
      gsap.fromTo(tooltip, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' });
    })
      .on('mousemove', (event) => {
        if (!tooltip) return;
        const rect = mapC.getBoundingClientRect();
        tooltip.style.left = `${event.clientX - rect.left + 20}px`;
        tooltip.style.top = `${event.clientY - rect.top - 14}px`;
      })
      .on('mouseleave', () => {
        if (!tooltip) return;
        gsap.to(tooltip, { opacity: 0, scale: 0.88, duration: 0.18, onComplete: () => { tooltip.hidden = true; } });
      });
  });

  ScrollTrigger.create({
    trigger: fold, start: 'top 62%', once: true,
    onEnter: () => gsap.from(pg.selectAll('g').nodes(), {
      scale: 0, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(2.5)',
      transformOrigin: 'center center',
    }),
  });

  gsap.from([fold.querySelector('.fold__title'), fold.querySelector('.fold__instruction')], {
    opacity: 0, y: 26, duration: 0.75, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
  });
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
  const y = d3.scaleLinear().domain([44, 68]).range([iH, 0]);

  g.append('g').attr('transform', `translate(0,${iH})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(4))
    .attr('class', 'chart-axis');
  g.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '%'))
    .attr('class', 'chart-axis');

  // Grille horizontale
  g.append('g').attr('class', 'grid')
    .call(d3.axisLeft(y).ticks(5).tickSize(-iW).tickFormat(''))
    .selectAll('line').style('stroke', 'rgba(0,0,0,0.05)').style('stroke-dasharray', '4 4');
  g.select('.grid .domain').remove();

  // Aire
  const area = d3.area()
    .x(d => x(d.annee)).y0(iH).y1(d => y(d.tres_actifs_pct))
    .curve(d3.curveCatmullRom.alpha(0.5));
  g.append('path').datum(data)
    .attr('fill', C.accent).attr('opacity', 0.07).attr('d', area);

  // Ligne
  const line = d3.line()
    .x(d => x(d.annee)).y(d => y(d.tres_actifs_pct))
    .curve(d3.curveCatmullRom.alpha(0.5));
  const path = g.append('path').datum(data)
    .attr('fill', 'none').attr('stroke', C.accent)
    .attr('stroke-width', 3).attr('stroke-linecap', 'round').attr('d', line);

  const len = path.node().getTotalLength();
  path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len);

  ScrollTrigger.create({
    trigger: container, start: 'top 74%', once: true,
    onEnter: () => {
      gsap.to(path.node(), { strokeDashoffset: 0, duration: 2.4, ease: 'power2.out' });
      data.forEach((d, i) => {
        const dot = g.append('circle')
          .attr('cx', x(d.annee)).attr('cy', y(d.tres_actifs_pct))
          .attr('r', 6).attr('fill', C.accent)
          .attr('stroke', 'white').attr('stroke-width', 2.5).style('opacity', 0);
        g.append('text').attr('class', 'chart-dot-label')
          .attr('x', x(d.annee)).attr('y', y(d.tres_actifs_pct) - 13)
          .attr('text-anchor', 'middle').text(`${d.tres_actifs_pct}%`).style('opacity', 0)
          .call(el => gsap.to(el.node(), { opacity: 1, duration: 0.3, delay: 0.6 + i * 0.5 }));
        gsap.to(dot.node(), { opacity: 1, duration: 0.35, delay: 0.5 + i * 0.5 });
      });
    },
  });

  // Personnage qui scroll sur le graphique
  const charWrap = document.createElement('div');
  charWrap.className = 'evolution-character';
  charWrap.innerHTML = avatarSVG('louis', 56);
  container.style.position = 'relative';
  container.appendChild(charWrap);

  gsap.to(charWrap, {
    x: iW * 0.78, ease: 'none',
    scrollTrigger: { trigger: fold, start: 'top center', end: 'bottom center', scrub: 1.2 },
  });

  gsap.from(fold.querySelector('.fold__subtitle'), {
    opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: fold, start: 'top 62%' },
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
  const y = d3.scaleLinear().domain([40, 72]).range([iH, 0]);

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

    // Point final avec label
    const last = lvl.data[lvl.data.length - 1];
    g.append('circle')
      .attr('cx', x(last.a)).attr('cy', y(last.v))
      .attr('r', 5).attr('fill', lvl.color).attr('stroke', C.bg_dark).attr('stroke-width', 2);
    g.append('text').attr('class', 'chart-dot-label')
      .attr('x', x(last.a) + 8).attr('y', y(last.v) + 4)
      .attr('fill', lvl.color).text(last.v + '%');
  });

  // 4 personnages
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
}

/* ═══════════════════════════════════════════════════════════════
   FOLDS 16-17 — Débat
   ═══════════════════════════════════════════════════════════════ */
function initDebate() {
  [
    { id: 'fold-16', left: 'louis', right: 'bruna' },
    { id: 'fold-17', left: 'chloe', right: 'thomas' },
  ].forEach(({ id, left, right }) => {
    const fold = document.getElementById(id);
    if (!fold) return;

    const scene = fold.querySelector('.debate-scene');
    if (!scene) return;

    const la = document.createElement('div');
    la.className = 'debate-avatar debate-avatar--left';
    la.innerHTML = avatarSVG(left, 70);

    const ra = document.createElement('div');
    ra.className = 'debate-avatar debate-avatar--right';
    ra.innerHTML = avatarSVG(right, 70);

    fold.appendChild(la);
    fold.appendChild(ra);

    const bubbles = fold.querySelectorAll('.debate-bubble');
    gsap.set([la, ra], { opacity: 0, y: 30, scale: 0.75 });
    gsap.set(bubbles, { opacity: 0, y: 24 });

    ScrollTrigger.create({
      trigger: fold, start: 'top 62%', once: true,
      onEnter: () => {
        gsap.to([la, ra], { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.18, ease: 'back.out(2)' });
        gsap.to(bubbles, { opacity: 1, y: 0, duration: 0.65, stagger: 0.45, delay: 0.3, ease: 'power2.out' });
      },
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

  // Flottement individuel
  chars.forEach((c, i) => {
    gsap.to(c, {
      y: -10, duration: 2 + i * 0.3,
      repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.4,
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   INIT GLOBAL
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  injectStats();
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