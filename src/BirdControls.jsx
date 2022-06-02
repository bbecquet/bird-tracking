import './BirdControls.css'
import { speciesList } from './config'
import { useSetting } from './Settings'

const SpeciesToggle = ({
  species: { name, name_en, color },
  isActive,
  setActive = () => {},
  setHighlighted,
}) => {
  return (
    <label
      style={{ '--speciesColor': `rgb(${color})` }}
      className={`speciesToggle ${isActive ? 'active' : ''}`}
      onMouseEnter={() => setHighlighted(name)}
      onMouseLeave={() => setHighlighted(null)}
    >
      <input
        type="checkbox"
        checked={isActive}
        onChange={() => {
          setActive(!isActive)
        }}
      />
      <div
        className="speciesPic u-mobileHidden"
        style={{
          backgroundImage: `url(imgs/species/${name.replace(' ', '_').toLocaleLowerCase()}.jpg)`,
        }}
      />
      <div>
        <div className="speciesCommonName">{name_en}</div>
        <div className="speciesLatinName u-mobileHidden">{name}</div>
      </div>
    </label>
  )
}

const BirdControls = () => {
  const [, setHighlighted] = useSetting('highlightedSpecies')
  const [activeSpeciesList, setActiveSpeciesList] = useSetting('activeSpeciesList', [])

  const createToggle = species => (
    <SpeciesToggle
      species={species}
      key={species.name}
      setHighlighted={setHighlighted}
      isActive={activeSpeciesList.includes(species.name)}
      setActive={isActive => {
        setActiveSpeciesList(
          isActive
            ? [...activeSpeciesList, species.name]
            : activeSpeciesList.filter(s => s !== species.name)
        )
      }}
    />
  )

  return (
    <div className="birdControls">
      <div className="birdType">
        <h2 className="u-mobileHidden">Raptors</h2>
        <div className="birdToggles">
          {speciesList.filter(s => s.type === 'raptor').map(createToggle)}
        </div>
      </div>
      <div className="birdType">
        <h2 className="u-mobileHidden">"Long legs"</h2>
        <div className="birdToggles">
          {speciesList.filter(s => s.type !== 'raptor').map(createToggle)}
        </div>
      </div>
    </div>
  )
}

export default BirdControls
