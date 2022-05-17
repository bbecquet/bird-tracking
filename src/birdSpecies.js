import * as rainbow from 'rainbow-colors'

const colors = rainbow.generate(10, { lum: 50, sat: 75, rgb: true }).map(c =>
  c
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(v => Number(v))
)

export const speciesList = [
  { name: 'Aegypius monachus', type: 'raptor' },
  { name: 'Aquila clanga', type: 'raptor' },
  { name: 'Aquila pomarina', type: 'raptor' },
  { name: 'Botaurus stellaris', type: 'other' },
  { name: 'Buteo buteo', type: 'raptor' },
  { name: 'Ciconia ciconia', type: 'other' },
  { name: 'Ciconia nigra', type: 'other' },
  { name: 'Grus grus', type: 'other' },
  { name: 'Haliaeetus albicilla', type: 'raptor' },
  { name: 'Pandion haliaetus', type: 'raptor' },
].map((s, i) => ({ ...s, color: colors[i] }))

export const speciesConfig = speciesList.reduce(
  (obj, current) => ({ ...obj, [current.name]: { ...current } }),
  {}
)
