import { usePokemonsLazyQuery, PokemonItem } from '../generated';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';

export default function Home() {
  const [pokemons, setPokemons] = useState<PokemonItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [getPokemons, { loading, data, fetchMore }] = usePokemonsLazyQuery({
    variables: {
      limit: 50,
      offset: 0
    }
  });

  useEffect(() => {
    getPokemons();
  }, []);

  useEffect(() => {
    if (data) {
      setPokemons((state) => [...state, ...data.pokemons.results]);
      setHasMore(data.pokemons.next !== null);
    }
  }, [data]);

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

  if (loading) return <h1>Loading...</h1>;

  return (
    <div>
      <h1>Pokemons</h1>
      <InfiniteScroll
        style={{ width: '400px' }}
        height={400}
        dataLength={pokemons.length || 0}
        next={handleFetchMore}
        hasMore={hasMore}
        loader={loading ? <h4>loading...</h4> : null}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {pokemons.map((pokemon) => (
          <div key={pokemon.id}>
            {pokemon.id} - {pokemon.name}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
