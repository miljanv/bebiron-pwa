'use client';

import { Pause, Play, Square } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MUSIC_TRACKS } from '@/constants';
import { cn } from '@/lib/utils/cn';
import type { MusicTrack } from '@/types';

type Status = 'idle' | 'loading' | 'playing' | 'paused';

export function MusicPanel() {
  const t = useTranslations();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggle = useCallback(
    async (track: MusicTrack) => {
      setError(null);
      const audio = audioRef.current;
      if (!audio) return;
      if (currentTrackId === track.id) {
        if (status === 'playing') {
          audio.pause();
          setStatus('paused');
        } else {
          try {
            await audio.play();
            setStatus('playing');
          } catch (e) {
            setError(e instanceof Error ? e.message : t('memories.couldNotPlay'));
          }
        }
        return;
      }
      setStatus('loading');
      audio.src = track.src;
      setCurrentTrackId(track.id);
      try {
        await audio.play();
        setStatus('playing');
      } catch (e) {
        setError(e instanceof Error ? e.message : t('memories.couldNotPlay'));
        setStatus('idle');
        setCurrentTrackId(null);
      }
    },
    [currentTrackId, status, t],
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setStatus('idle');
    setCurrentTrackId(null);
  }, []);

  const hasActive = currentTrackId != null && status !== 'idle';

  return (
    <div className="px-5">
      <p className="text-sm text-brand-text-muted">{t('memories.soundsForSleep')}</p>
      <p className="mt-1 text-xs text-brand-text-muted">{t('memories.backgroundPlaybackHint')}</p>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      {hasActive ? (
        <button
          type="button"
          onClick={stop}
          className="mt-4 inline-flex items-center gap-2 rounded-brand-md border border-border bg-card px-3 py-2 text-xs font-semibold text-brand-text-muted"
        >
          <Square className="h-3.5 w-3.5 fill-current" />
          {t('memories.stopPlayback')}
        </button>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3 pb-8 md:grid-cols-3 lg:grid-cols-4">
        {MUSIC_TRACKS.map((track) => {
          const isActive = currentTrackId === track.id;
          const isPlaying = isActive && status === 'playing';
          const isPaused = isActive && status === 'paused';
          const isLoading = isActive && status === 'loading';
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => toggle(track)}
              disabled={isLoading}
              className={cn(
                'flex min-h-[140px] flex-col items-start gap-2 rounded-brand-md p-5 text-left shadow-brand transition',
                isActive ? 'accent-bg text-white' : 'bg-card text-foreground',
              )}
            >
              <span className="text-3xl">{track.emoji}</span>
              <span className="text-sm font-semibold">{t(track.titleKey)}</span>
              <span
                className={cn(
                  'mt-auto inline-flex items-center gap-1.5 text-xs',
                  isActive ? 'text-white/80' : 'text-brand-text-muted',
                )}
              >
                {isLoading ? (
                  <LoadingSpinner size={12} className={cn(isActive ? 'text-white' : '')} />
                ) : isPlaying ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                {isLoading
                  ? t('common.loading')
                  : isPlaying
                    ? t('memories.playing')
                    : isPaused
                      ? t('memories.paused')
                      : t('memories.play')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
