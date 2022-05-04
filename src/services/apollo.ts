import { ApolloClient, InMemoryCache, useQuery, gql} from '@apollo/client';

export const client = new ApolloClient({
	uri: 'https://graphql-pokeapi.graphcdn.app',
	cache: new InMemoryCache()
});

// client.query({
// 	query: gql`
// 		query pokemons($limit: Int, $offset: Int) {
// 			pokemons(limit: $limit, offset: $offset) {
// 				count
// 				next
// 				previous
// 				status
// 				message
// 				results {
// 					url
// 					name
// 					image
// 				}
// 			}
// 		}
// 	`
// }).then(result => console.log(result));