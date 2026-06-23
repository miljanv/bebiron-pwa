type Props = {
  size?: number;
};

export function SleepingBabyIllustration({ size = 192 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden>
      <path
        d="M 60 120 Q 60 80 100 70 Q 140 80 140 120 Q 140 140 100 145 Q 60 140 60 120 Z"
        fill="#A4C4D4"
        opacity={0.3}
      />
      <circle cx="100" cy="100" r="25" fill="#E8DED0" />
      <path
        d="M 88 95 Q 92 97 96 95"
        stroke="#9A8F82"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 104 95 Q 108 97 112 95"
        stroke="#9A8F82"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 92 108 Q 100 112 108 108"
        stroke="#9A8F82"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="65" cy="75" r="3" fill="#8B9B8E" opacity={0.6} />
      <circle cx="135" cy="80" r="2.5" fill="#A4C4D4" opacity={0.6} />
      <circle cx="80" cy="60" r="2" fill="#8B9B8E" opacity={0.6} />
      <circle cx="120" cy="65" r="2" fill="#A4C4D4" opacity={0.6} />
    </svg>
  );
}
