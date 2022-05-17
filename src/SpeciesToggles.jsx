const SpeciesToggle = ({
  species: { name, color },
  isActive,
  setActive = () => {},
  setHighlighted,
}) => {
  return (
    <div
      style={{ '--speciesColor': `rgb(${color})` }}
      className={`speciesToggle ${isActive ? 'active' : ''}`}
      onClick={() => {
        setActive(!isActive)
      }}
      onMouseEnter={() => setHighlighted(name)}
      onMouseLeave={() => setHighlighted(null)}
    >
      <div
        className="speciesPic"
        style={{
          backgroundImage: `url(imgs/species/${name.replace(' ', '_').toLocaleLowerCase()}.jpg)`,
        }}
      />
      {name}
    </div>
  )
}

const SpeciesToggles = ({
  speciesList,
  activeSpeciesList,
  setActiveSpeciesList,
  setHighlighted,
}) => {
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
      <div>
        <h2>Raptors</h2>
        <div className="bird-toggles">
          {speciesList.filter(s => s.type === 'raptor').map(createToggle)}
        </div>
      </div>
      <div>
        <h2>"Long legs"</h2>
        <div className="bird-toggles">
          {speciesList.filter(s => s.type !== 'raptor').map(createToggle)}
        </div>
      </div>
    </div>
  )
}

export default SpeciesToggles
