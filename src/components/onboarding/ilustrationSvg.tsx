export function IllustrationReport() {
  return (
    <svg
      viewBox="0 0 280 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Phone frame */}
      <rect
        x="90"
        y="20"
        width="100"
        height="180"
        rx="16"
        fill="currentColor"
        className="text-primary/10"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.3"
      />
      <rect
        x="100"
        y="34"
        width="80"
        height="120"
        rx="6"
        fill="currentColor"
        className="text-primary/15"
      />

      {/* Camera viewfinder */}
      <rect
        x="108"
        y="42"
        width="64"
        height="56"
        rx="4"
        fill="currentColor"
        className="text-background/80"
      />
      {/* Road texture in viewfinder */}
      <rect
        x="108"
        y="42"
        width="64"
        height="56"
        rx="4"
        fill="currentColor"
        className="text-primary/8"
      />
      <line
        x1="108"
        y1="76"
        x2="172"
        y2="76"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      <line
        x1="108"
        y1="84"
        x2="172"
        y2="84"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      {/* Pothole in viewfinder */}
      <ellipse
        cx="140"
        cy="66"
        rx="14"
        ry="8"
        fill="currentColor"
        className="text-destructive/30"
      />
      <ellipse
        cx="140"
        cy="66"
        rx="10"
        ry="5"
        fill="currentColor"
        className="text-destructive/20"
      />
      {/* Corner brackets */}
      <path
        d="M114 48 L114 54 M114 48 L120 48"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M166 48 L166 54 M166 48 L160 48"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M114 92 L114 86 M114 92 L120 92"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M166 92 L166 86 M166 92 L160 92"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Form fields */}
      <rect
        x="108"
        y="106"
        width="64"
        height="7"
        rx="3"
        fill="currentColor"
        className="text-primary/20"
      />
      <rect
        x="108"
        y="118"
        width="44"
        height="7"
        rx="3"
        fill="currentColor"
        className="text-foreground/10"
      />

      {/* Send button */}
      <rect
        x="108"
        y="133"
        width="64"
        height="14"
        rx="7"
        fill="currentColor"
        className="text-primary/70"
      />
      <text
        x="140"
        y="143"
        textAnchor="middle"
        fontSize="7"
        fill="white"
        fontWeight="600"
        opacity="0.9"
      >
        Kirim Laporan
      </text>

      {/* Home indicator */}
      <rect
        x="125"
        y="188"
        width="30"
        height="3"
        rx="1.5"
        fill="currentColor"
        className="text-foreground/20"
      />

      {/* Location pin floating */}
      <circle
        cx="62"
        cy="90"
        r="22"
        fill="currentColor"
        className="text-primary/10"
      />
      <path
        d="M62 78 C57.6 78 54 81.6 54 86 C54 91.9 62 100 62 100 C62 100 70 91.9 70 86 C70 81.6 66.4 78 62 78Z"
        fill="currentColor"
        className="text-primary/70"
      />
      <circle cx="62" cy="86" r="3" fill="white" />

      {/* Signal waves */}
      <path
        d="M50 78 C52 74 56 72 60 72"
        stroke="currentColor"
        className="text-primary/40"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M47 75 C50 69 56 66 62 66"
        stroke="currentColor"
        className="text-primary/25"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Sparkles */}
      <circle
        cx="210"
        cy="55"
        r="3"
        fill="currentColor"
        className="text-primary/50"
      />
      <circle
        cx="220"
        cy="80"
        r="2"
        fill="currentColor"
        className="text-primary/30"
      />
      <circle
        cx="205"
        cy="130"
        r="2.5"
        fill="currentColor"
        className="text-primary/40"
      />
    </svg>
  );
}

export function IllustrationAI() {
  return (
    <svg
      viewBox="0 0 280 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Main card */}
      <rect
        x="40"
        y="30"
        width="200"
        height="160"
        rx="16"
        fill="currentColor"
        className="text-primary/8"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1.5"
      />

      {/* Image preview area */}
      <rect
        x="56"
        y="46"
        width="80"
        height="60"
        rx="8"
        fill="currentColor"
        className="text-primary/12"
      />
      {/* Road lines */}
      <line
        x1="56"
        y1="88"
        x2="136"
        y2="88"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="8"
      />
      <line
        x1="56"
        y1="100"
        x2="136"
        y2="100"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="6"
      />
      {/* Detected pothole with bounding box */}
      <rect
        x="75"
        y="58"
        width="32"
        height="24"
        rx="2"
        stroke="currentColor"
        className="text-destructive/70"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <ellipse
        cx="91"
        cy="70"
        rx="10"
        ry="6"
        fill="currentColor"
        className="text-destructive/25"
      />
      <text
        x="79"
        y="57"
        fontSize="5.5"
        fill="currentColor"
        className="text-destructive"
        fontWeight="700"
        opacity="0.8"
      >
        RUSAK
      </text>

      {/* AI processing indicator */}
      <circle
        cx="96"
        cy="76"
        r="4"
        fill="currentColor"
        className="text-primary/50"
      />
      <circle
        cx="96"
        cy="76"
        r="2"
        fill="currentColor"
        className="text-primary"
      />

      {/* Result panel */}
      <rect
        x="152"
        y="46"
        width="72"
        height="60"
        rx="8"
        fill="currentColor"
        className="text-background/60"
      />

      {/* Severity badge */}
      <rect
        x="160"
        y="54"
        width="40"
        height="14"
        rx="7"
        fill="currentColor"
        className="text-destructive/20"
      />
      <text
        x="180"
        y="64"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        className="text-destructive"
        fontWeight="700"
      >
        PARAH
      </text>

      {/* Score bar */}
      <text
        x="160"
        y="80"
        fontSize="5.5"
        fill="currentColor"
        className="text-foreground/40"
        fontWeight="500"
      >
        Akurasi
      </text>
      <rect
        x="160"
        y="83"
        width="56"
        height="4"
        rx="2"
        fill="currentColor"
        className="text-foreground/10"
      />
      <rect
        x="160"
        y="83"
        width="46"
        height="4"
        rx="2"
        fill="currentColor"
        className="text-primary/60"
      />

      {/* Count */}
      <text
        x="160"
        y="98"
        fontSize="5.5"
        fill="currentColor"
        className="text-foreground/40"
      >
        Lubang terdeteksi:
      </text>
      <text
        x="208"
        y="98"
        fontSize="5.5"
        fill="currentColor"
        className="text-foreground/70"
        fontWeight="700"
      >
        3
      </text>

      {/* Bottom info rows */}
      <rect
        x="56"
        y="118"
        width="168"
        height="10"
        rx="3"
        fill="currentColor"
        className="text-foreground/8"
      />
      <rect
        x="56"
        y="118"
        width="110"
        height="10"
        rx="3"
        fill="currentColor"
        className="text-primary/12"
      />

      <rect
        x="56"
        y="134"
        width="168"
        height="10"
        rx="3"
        fill="currentColor"
        className="text-foreground/8"
      />
      <rect
        x="56"
        y="134"
        width="80"
        height="10"
        rx="3"
        fill="currentColor"
        className="text-primary/12"
      />

      <rect
        x="56"
        y="150"
        width="168"
        height="10"
        rx="3"
        fill="currentColor"
        className="text-foreground/8"
      />
      <rect
        x="56"
        y="150"
        width="130"
        height="10"
        rx="3"
        fill="currentColor"
        className="text-primary/12"
      />

      {/* Neural network dots decoration */}
      {[
        [230, 25],
        [245, 40],
        [240, 18],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="3"
          fill="currentColor"
          className="text-primary/30"
        />
      ))}
      <line
        x1="230"
        y1="25"
        x2="245"
        y2="40"
        stroke="currentColor"
        className="text-primary/20"
        strokeWidth="1"
      />
      <line
        x1="240"
        y1="18"
        x2="245"
        y2="40"
        stroke="currentColor"
        className="text-primary/20"
        strokeWidth="1"
      />

      {/* Verified checkmark */}
      <circle
        cx="218"
        cy="76"
        r="10"
        fill="currentColor"
        className="text-primary/15"
      />
      <path
        d="M213 76 L216.5 79.5 L223 73"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IllustrationImpact() {
  return (
    <svg
      viewBox="0 0 280 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Map background */}
      <rect
        x="30"
        y="25"
        width="220"
        height="155"
        rx="14"
        fill="currentColor"
        className="text-primary/6"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1.5"
      />

      {/* Map grid lines */}
      {[50, 75, 100, 125, 150].map((y) => (
        <line
          key={y}
          x1="30"
          y1={y}
          x2="250"
          y2={y}
          stroke="currentColor"
          strokeOpacity="0.05"
          strokeWidth="1"
        />
      ))}
      {[70, 110, 150, 190, 230].map((x) => (
        <line
          key={x}
          x1={x}
          y1="25"
          x2={x}
          y2="180"
          stroke="currentColor"
          strokeOpacity="0.05"
          strokeWidth="1"
        />
      ))}

      {/* Roads */}
      <path
        d="M30 110 Q100 100 140 110 Q180 120 250 108"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M140 25 Q135 80 140 110 Q145 140 138 180"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M80 25 Q85 70 95 95 Q110 130 130 180"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Report pins — high */}
      <g>
        <circle
          cx="100"
          cy="95"
          r="10"
          fill="currentColor"
          className="text-destructive/20"
        />
        <path
          d="M100 84 C96.7 84 94 86.7 94 90 C94 94.2 100 101 100 101 C100 101 106 94.2 106 90 C106 86.7 103.3 84 100 84Z"
          fill="currentColor"
          className="text-destructive/80"
        />
        <circle cx="100" cy="90" r="2.5" fill="white" />
      </g>

      {/* Report pins — medium */}
      <g>
        <circle
          cx="160"
          cy="115"
          r="8"
          fill="currentColor"
          className="text-amber-500/20"
        />
        <path
          d="M160 106 C157.3 106 155 108.3 155 111 C155 114.4 160 120 160 120 C160 120 165 114.4 165 111 C165 108.3 162.7 106 160 106Z"
          fill="currentColor"
          className="text-amber-500/80"
        />
        <circle cx="160" cy="111" r="2" fill="white" />
      </g>

      {/* Report pins — low */}
      <g>
        <path
          d="M75 135 C72.7 135 71 137 71 139.5 C71 142.6 75 147 75 147 C75 147 79 142.6 79 139.5 C79 137 77.3 135 75 135Z"
          fill="currentColor"
          className="text-green-500/70"
        />
        <circle cx="75" cy="139" r="1.8" fill="white" />
      </g>
      <g>
        <path
          d="M195 80 C192.7 80 191 82 191 84.5 C191 87.6 195 92 195 92 C195 92 199 87.6 199 84.5 C199 82 197.3 80 195 80Z"
          fill="currentColor"
          className="text-green-500/70"
        />
        <circle cx="195" cy="84" r="1.8" fill="white" />
      </g>
      <g>
        <path
          d="M220 135 C217.7 135 216 137 216 139.5 C216 142.6 220 147 220 147 C220 147 224 142.6 224 139.5 C224 137 222.3 135 220 135Z"
          fill="currentColor"
          className="text-amber-500/70"
        />
        <circle cx="220" cy="139" r="1.8" fill="white" />
      </g>

      {/* Upvote popup */}
      <rect
        x="108"
        y="78"
        width="52"
        height="24"
        rx="8"
        fill="currentColor"
        className="text-background"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      <text
        x="118"
        y="93"
        fontSize="7"
        fill="currentColor"
        className="text-foreground/60"
      >
        👍
      </text>
      <text
        x="130"
        y="93"
        fontSize="7"
        fill="currentColor"
        className="text-foreground/70"
        fontWeight="600"
      >
        +24 warga
      </text>

      {/* Connector line from pin to popup */}
      <line
        x1="100"
        y1="84"
        x2="112"
        y2="90"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      {/* Stats bar at bottom */}
      <rect
        x="30"
        y="168"
        width="220"
        height="12"
        rx="0"
        fill="currentColor"
        className="text-primary/8"
      />
      <rect
        x="30"
        y="168"
        width="220"
        height="12"
        rx="0"
        ry="0"
        style={{ borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }}
      />

      {/* Stats items */}
      <circle
        cx="80"
        cy="174"
        r="3"
        fill="currentColor"
        className="text-destructive/60"
      />
      <text
        x="87"
        y="177"
        fontSize="5.5"
        fill="currentColor"
        className="text-foreground/50"
        fontWeight="500"
      >
        342 Laporan
      </text>

      <circle
        cx="155"
        cy="174"
        r="3"
        fill="currentColor"
        className="text-amber-500/60"
      />
      <text
        x="162"
        y="177"
        fontSize="5.5"
        fill="currentColor"
        className="text-foreground/50"
        fontWeight="500"
      >
        Diperbaiki: 89
      </text>
    </svg>
  );
}
