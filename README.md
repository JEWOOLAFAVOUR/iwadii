# ìwádìí — Curiosity Flows Through Culture

> _"ìwádìí" (Yoruba): Wonder • Curiosity • The pursuit of knowledge through creative exploration_

A premium creative portfolio experience inspired by Kokuyo's "Curiosity is Life," reimagined through the vibrant lens of Yoruba culture. Built with modern web technologies to deliver pixel-perfect animations and cultural authenticity.

## Design Philosophy

**ìwádìí** merges two worlds:

- **Visual Language**: Inspired by Kokuyo's refined diagonal wipe animations and color sequencing
- **Cultural Soul**: Rooted in Yoruba aesthetics using the Ojuju typeface and a carefully curated color palette that echoes the richness of African design

The experience unfolds as a visual narrative—colors sweep in diagonally, revealing layers of meaning with each transition, just as curiosity reveals new dimensions of understanding.

## Key Features

- **Animated Color Cycle**: 5 vibrant colors (`#b5f80f`, `#02b5fd`, `#0ab579`, `#FF006E`, `#FFB703`) sweep in with diagonal clip-path animations
- **Seamless Reveal**: Full-screen image reveal after the color sequence completes
- **Synchronized Text Animations**: The "Curiosity is Life" tagline and logo cycle through the same color palette continuously
- **Yoruba Typography**: Ojuju Google Font for cultural resonance
- **Premium Feel**: Smooth easing curves and thoughtful timing create a luxurious browsing experience

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ìwádìí

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the magic unfold.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router & TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**:
  - CSS clip-path transitions for diagonal wipes
  - [Framer Motion](https://www.framer.com/motion/) (available for future scroll interactions)
  - [GSAP](https://gsap.com/) (available for complex timelines)
- **Typography**: [Ojuju](https://fonts.google.com/specimen/Ojuju) Google Font
- **Scroll Magic**: [Lenis](https://lenis.darkroom.engineering/) (ready for implementation)

## Project Structure

```
ìwádìí/
├── src/
│   └── app/
│       ├── page.tsx           # Main hero with animations
│       ├── layout.tsx         # Root layout with fonts
│       └── globals.css        # Global styles & font imports
├── public/
│   └── iwadii-bg.jpg         # Background reveal image
└── tailwind.config.ts         # Tailwind configuration
```

## How It Works

### Intro Sequence (5 cycles)

1. Colors sweep in diagonally from bottom-right to top-left
2. Each cycle lasts 0.9s with a cubic-bezier easing curve
3. 800ms delay between each color
4. After 5 cycles, the background image reveals smoothly

### Text Background Cycle

- After image reveal, "Curiosity is Life" boxes continuously cycle through colors
- Same diagonal animation (1.2s), synchronized timing
- Logo ("ìwádìí") shares the same color palette
- Creates a living, breathing effect

## Color Palette

Inspired by Lagos sunsets and Yoruba festivals:

| Color         | Hex       | Meaning             |
| ------------- | --------- | ------------------- |
| Electric Lime | `#b5f80f` | Energy, Innovation  |
| Ocean Blue    | `#02b5fd` | Clarity, Wisdom     |
| Forest Green  | `#0ab579` | Growth, Heritage    |
| Magenta       | `#FF006E` | Passion, Creativity |
| Golden Orange | `#FFB703` | Warmth, Celebration |

## Responsive Design

The experience adapts gracefully across all screen sizes with `clamp()` functions for scalable typography and flexible layouts.

## Internationalization

The Ojuju font handles Yoruba diacritics perfectly. Text remains readable and culturally accurate across all devices.

## What's Next

- [ ] Scroll-triggered animations using GSAP ScrollTrigger
- [ ] Smooth scroll experience with Lenis
- [ ] Additional portfolio sections with staggered reveals
- [ ] Interactive project cards with hover animations
- [ ] Dark mode toggle
- [ ] Multi-language support (English/Yoruba)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Ojuju Font](https://fonts.google.com/specimen/Ojuju)
- [Kokuyo Design](https://www.kokuyo-d.com/)

## Contributing

Contributions are welcome! Whether it's refining animations, adding new sections, or improving cultural representation—let's build together.

## License

Open source, created with intention and curiosity.

---

**ìwádìí** — Where curiosity meets culture. Every color tells a story. Every animation reveals something new.
