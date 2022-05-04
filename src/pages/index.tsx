import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import {
  usePokemonsLazyQuery,
  PokemonItem,
  usePokemonLazyQuery
} from '../generated';

interface FormData {
  pokemon: string;
}

export default function Home() {
  const { register, handleSubmit, reset } = useForm();
  const [pokemons, setPokemons] = useState<PokemonItem[]>([]);
  const [pokemon, setPokemon] = useState<PokemonItem>();
  const [hasMore, setHasMore] = useState(true);
  const [getPokemons, { loading, data, fetchMore }] = usePokemonsLazyQuery({
    variables: {
      limit: 23,
      offset: 0
    }
  });
  const [getPokemon, { error }] = usePokemonLazyQuery();

  useEffect(() => {
    getPokemons();
  }, [getPokemons]);

  useEffect(() => {
    if (data) {
      setPokemons((state) => [...state, ...data.pokemons.results]);
      setHasMore(data.pokemons.next !== null);
    }
  }, [data]);

  function handleSearchPokemon(data: FormData) {
    const searchPokemon = data.pokemon.toLocaleLowerCase().trim();

    if (searchPokemon === '') {
      setPokemon(undefined);
      return;
    }

    getPokemon({
      variables: {
        name: searchPokemon
      },
      onCompleted: (result) => {
        setPokemon({
          id: result.pokemon.id,
          name: result.pokemon.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result.pokemon.id}.png`
        });
      },
      onError: (error) => {
        if (pokemon) {
          setPokemon(undefined);
        }
        console.log(error);
      }
    });
    reset();
  }

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        offset: pokemons.length
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return fetchMoreResult;
      }
    });
  };

  return (
    <div>
      <h1>Pokemons</h1>
      <form onSubmit={handleSubmit(handleSearchPokemon)}>
        <input
          name="pokemon"
          placeholder="id or name"
          {...register('pokemon')}
        />
        <button type="submit">Search</button>
      </form>
      {error?.message.includes('404') && <span>Pokemon not found</span>}
      <InfiniteScroll
        style={{ width: '400px', marginTop: '32px' }}
        height={400}
        dataLength={pokemons.length}
        next={handleFetchMore}
        hasMore={hasMore}
        loader={loading ? <h4>loading...</h4> : null}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <ul>
          {pokemon ? (
            <li>
              {pokemon.id} - {pokemon.name}
              <div>
                <Image
                  src={pokemon.image}
                  width={96}
                  height={96}
                  alt={pokemon.name}
                />
              </div>
            </li>
          ) : (
            <>
              {pokemons.map((pokemon) => (
                <li key={pokemon.id}>
                  {pokemon.id} - {pokemon.name}
                  <div>
                    <Image
                      src={pokemon.image}
                      width={96}
                      height={96}
                      alt={pokemon.name}
                    />
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
