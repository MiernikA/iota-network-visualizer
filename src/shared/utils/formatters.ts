const NANO_PER_IOTA = 1_000_000_000

export function formatCompact(value: number, digits = 1): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatIota(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
  }).format(value / NANO_PER_IOTA)
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

export function formatShortHash(hash: string, width = 6): string {
  if (hash.length <= width * 2) {
    return hash
  }

  return `${hash.slice(0, width)}...${hash.slice(-width)}`
}

