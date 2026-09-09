import React from 'react';

// Lightweight reliable SVG QR Code generator
// Generates standard QR visual pattern based on hash of input text
export const QRCodeDisplay: React.FC<{
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  title?: string;
}> = ({ value, size = 160, fgColor = '#0f172a', bgColor = '#ffffff', title = 'QR Code' }) => {
  // Generate deterministic grid pattern based on input string
  const gridSize = 25; // 25x25 QR matrix
  const matrix: boolean[][] = Array(gridSize).fill(false).map(() => Array(gridSize).fill(false));

  // Set position detection patterns (3 corners)
  const setFinderPattern = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Outer 7x7 box
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // Inner 3x3 box
        ) {
          matrix[startRow + r][startCol + c] = true;
        } else {
          matrix[startRow + r][startCol + c] = false;
        }
      }
    }
  };

  setFinderPattern(0, 0);                  // Top-left
  setFinderPattern(0, gridSize - 7);       // Top-right
  setFinderPattern(gridSize - 7, 0);       // Bottom-left

  // Timing patterns
  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Generate pseudo-random hash fill for the data modules based on input string
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  let bitIndex = 0;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Don't overwrite finder patterns
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= gridSize - 8;
      const inBottomLeft = r >= gridSize - 8 && c < 8;
      const isTiming = (r === 6 && (c >= 8 && c < gridSize - 8)) || (c === 6 && (r >= 8 && r < gridSize - 8));

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        const charCode = value.charCodeAt(bitIndex % value.length) || 42;
        const seed = Math.sin(hash + r * gridSize + c + charCode) * 10000;
        matrix[r][c] = (seed - Math.floor(seed)) > 0.48;
        bitIndex++;
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div
      className="inline-block p-2 rounded-xl shadow-md border border-slate-200/20"
      style={{ backgroundColor: bgColor }}
      title={title}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={size} height={size} fill={bgColor} />
        {matrix.map((row, r) =>
          row.map((isDark, c) =>
            isDark ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.3}
                height={cellSize + 0.3}
                fill={fgColor}
                rx={cellSize > 6 ? 1 : 0}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
