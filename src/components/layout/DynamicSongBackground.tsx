import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { useThemeStore } from '../../store/themeStore';
import { getSongTheme, SongColorPalette } from '../../utils/songColorTheme';

export const DynamicSongBackground: React.FC = () => {
  const { currentSong } = usePlayerStore();
  const { resolvedTheme } = useThemeStore();

  const isDark = resolvedTheme === 'dark';
  const palette: SongColorPalette | null = useMemo(
    () => getSongTheme(currentSong),
    [currentSong?.id, currentSong?.title, currentSong?.genre]
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-700"
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        {palette && currentSong ? (
          <motion.div
            key={currentSong.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Layer 1: Very subtle blurred artwork ambient backdrop */}
            {currentSong.coverImage && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 scale-125 filter blur-[90px] saturate-150"
                style={{
                  backgroundImage: `url(${currentSong.coverImage})`,
                  opacity: isDark ? 0.09 : 0.06,
                }}
              />
            )}

            {/* Layer 2: Primary & Secondary Large Ambient Gradient Orbs */}
            <div
              className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full filter blur-[120px] transition-all duration-1000"
              style={{
                backgroundColor: isDark ? palette.dark.ambientBlob1 : palette.light.ambientBlob1,
              }}
            />
            <div
              className="absolute top-[15%] -right-[10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full filter blur-[130px] transition-all duration-1000"
              style={{
                backgroundColor: isDark ? palette.dark.ambientBlob2 : palette.light.ambientBlob2,
              }}
            />

            {/* Layer 3: Soft dynamic radial gradient mapping */}
            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{
                background: isDark ? palette.dark.bgGradient : palette.light.bgGradient,
              }}
            />

            {/* Layer 4: Vignette & Strong Readability Overlay */}
            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{
                background: isDark ? palette.dark.vignette : palette.light.vignette,
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Layer 5: Base theme fallback overlay to ensure seamless continuity */}
      <div className="absolute inset-0 bg-background/30 pointer-events-none" />
    </div>
  );
};
