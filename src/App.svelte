<script>
  import http from './helpers/request-helper'
  import { OperationDocsHelper } from './helpers/operation-docs-helper';
  import { ApolloClient, InMemoryCache } from '@apollo/client';
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  
  function createApolloClient() {

    const wsLink = new WebSocketLink({
      uri: "wss://hasura-lab-3.herokuapp.com/v1/graphql",
      options: {
       reconnect: true,
      },
    });
    
    const cache = new InMemoryCache(); 
    const client = new ApolloClient({
      link: wsLink,
      cache,
    }); 

    return client;
  }

  const client = createApolloClient();
  setClient(client);
  
  const music = subscribe(OperationDocsHelper.SUBSCRIPTION);

  const stringToNumber = (string) => {
    return isNaN(+string) ? 0 : +string;
  }

  const addSong = async () => {
    const name = prompt('Song name: ');
    const author = prompt('Author: ');
    const listenings = stringToNumber(prompt('Listenings: '));
    const genre = prompt('Genre: ');
    if (listenings <= 0) return;
    await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_INSERT_ONE(name, author, genre, listenings));
  }

  const deleteSong = async () => {
    const nameEntered = prompt('Song name: ');
    const authorEntered = prompt('Author: ');
    await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_DELETE(), {name: nameEntered, author: authorEntered});
  }
</script>

<main>
  {#if $music.loading}
    <h1>loading ...</h1>
  {:else if $music.error}
    <h1>Error!</h1>
  {:else if $music.data}
    <button on:click={addSong}>Add song</button>
    <button on:click={deleteSong}>Delete song</button>
    <table border="2">
      <caption>Music</caption>
        <tr>
          <th>Name</th>
          <th>Author</th>
          <th>Listenings</th>
          <th>Genre</th>
        </tr>
    {#each $music.data.lab3_music as music (music.id)}
      <tr>
        <td>{music.name}</td>
        <td>{music.author}</td>
        <td>{music.listenings}</td>
        <td>{music.genre}</td>
      </tr> 
    {/each}
    </table>
  {/if}
</main>

<style>
</style>