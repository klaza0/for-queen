# For Queen | A Locked Birthday Surprise

A personal, locked birthday experience by **Ibrahim Montaser / IMDEV**. The site opens on a PIN pad; only the right code unlocks the surprise inside, with a birthday song and an animated, cinematic reveal.

**[Open the live experience](https://for-queen-sandy.vercel.app/)**

## Preview

### The lock screen
![For Queen lock screen with a PIN pad and music player](https://github.com/user-attachments/assets/1312a476-7ca5-4aee-9811-c56faf201107)

## Features

- A PIN lock screen that guards the surprise.
- A built-in music player for the birthday song.
- Animated scenes and transitions powered by GSAP and Motion.
- A configurable friendship-start year that personalizes the content.
- Zero backend: a single Next.js app deployable to Vercel with no environment variables.

## Built with

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 |
| UI | React 19 + TypeScript |
| Animation | GSAP, Motion |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The lock code is `0702`.

Put the song at `public/audio/birthday-song.mp3`.

Set `FRIENDSHIP_START_YEAR` in `src/config/queen.ts` when the year is known.

## Deploy

Import the project on Vercel. No extra environment variables are required.

---

Built by **Ibrahim Montaser / IMDEV**.
