import * as rainbow from 'rainbow-colors'

const colors = rainbow.generate(10, { lum: 50, sat: 75, rgb: true }).map(c =>
  c
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(v => Number(v))
)

export const speciesList = [
  {
    name: 'Aegypius monachus',
    name_en: 'Cinereous vulture',
    name_fr: 'Vautour moine',
    type: 'raptor',
  },
  {
    name: 'Aquila clanga',
    name_en: 'Greater spotted eagle',
    name_fr: 'Aigle criard',
    type: 'raptor',
  },
  {
    name: 'Aquila pomarina',
    name_en: 'Lesser spotted eagle',
    name_fr: 'Aigle Pomarin',
    type: 'raptor',
  },
  {
    name: 'Botaurus stellaris',
    name_en: 'Eurasian bittern',
    name_fr: 'Butor étoilé',
    type: 'other',
  },
  { name: 'Buteo buteo', name_en: 'Common buzzard', name_fr: 'Buse variable', type: 'raptor' },
  { name: 'Ciconia ciconia', name_en: 'White stork', name_fr: 'Cigogne blanche', type: 'other' },
  { name: 'Ciconia nigra', name_en: 'Black stork', name_fr: 'Cigogne noire', type: 'other' },
  { name: 'Grus grus', name_en: 'Common crane', name_fr: 'Grue cendrée', type: 'other' },
  {
    name: 'Haliaeetus albicilla',
    name_en: 'White-tailed eagle',
    name_fr: 'Pygargue à queue blanche',
    type: 'raptor',
  },
  { name: 'Pandion haliaetus', name_en: 'Osprey', name_fr: 'Balbuzard pêcheur', type: 'raptor' },
].map((s, i) => ({ ...s, color: colors[i] }))

export const speciesConfig = speciesList.reduce(
  (obj, current) => ({ ...obj, [current.name]: { ...current } }),
  {}
)

export const ANIMATION_SPEED = 3600 * 5 // 1 "step", in seconds
export const INITIAL_SAME_YEAR = true
export const AUTO_PLAY = true
