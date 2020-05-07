import React, { Component } from "react"
import User from "../interfaces/User.interface";

interface SearchState {
  error: boolean;
  pokemon: Pokemon | null;
}

interface Pokemon {
  name: string;
  numberOfAbilities: number;
  baseExperience: number;
  imageUrl: string;
}

export class PokemonSearch extends Component<User, SearchState> {

  pokemonRef: React.RefObject<HTMLInputElement>;

  constructor(props: User) {
    super(props);
    this.state = {
      error: false,
      pokemon: null,
    }
    this.pokemonRef = React.createRef();
  }

  onSearchClick = async () => {
    const inputValue = this.pokemonRef.current?.value ?? "unknown";

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`);
    if (response.status === 200) {
      const pokemonData = await response.json();
      this.setState({
        error: false,
        pokemon: {
          name: pokemonData.name,
          numberOfAbilities: pokemonData.abilities.length,
          baseExperience: pokemonData.base_experience,
          imageUrl: pokemonData.sprites.front_default,
        }
      });
    }
    else {
      this.setState({ error: true });
    }
  }

  render() {
    const { name: userName, numberOfPokemons } = this.props;
    const { error, pokemon  } = this.state;
    let resultMarkup;

    if (error) {
      resultMarkup = <p>Pokemon not found</p>
    }
    else if (pokemon != null) {
      resultMarkup = <div>
        <img src={pokemon.imageUrl} alt="pokemon" className="pokemon-image"></img>
        <p>
          {pokemon.name} has { pokemon.numberOfAbilities } abilities and { pokemon.baseExperience } base experience points
        </p>
      </div>
    }

    return (
      <div>
        <p>
          User {userName} {' '}
          { numberOfPokemons && <span>has {numberOfPokemons} pokemons</span> }
        </p>
        <input type="text" ref={this.pokemonRef}></input>
        <button onClick={this.onSearchClick} className="my-button">Search</button>
        {resultMarkup}
      </div>
    )
  }
}

export default PokemonSearch