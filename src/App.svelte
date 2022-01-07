<script>
  import http from "./helpers/request-helper";
  import { OperationDocsHelper } from "./helpers/operation-docs-helper";
  import { ApolloClient, InMemoryCache } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { Jumper } from "svelte-loading-spinners";
  import { errorMsg, spinnersAmount } from "./helpers/store";

  function createApolloClient() {
    const wsLink = new WebSocketLink({
      uri: WS_LINK,
      options: {
        reconnect: true,
      },
    });

    const cache = new InMemoryCache();
    return new ApolloClient({
      link: wsLink,
      cache,
    });
  }

  let errorValue, spinnervalue, addDisableFlag, deleteDisableFlag;
  const tableInfo = {};

  errorMsg.subscribe((msg) => {
    errorValue = msg;
  });

  spinnersAmount.subscribe((amount) => {
    spinnervalue = amount;
  });

  const client = createApolloClient();
  setClient(client);

  const music = subscribe(OperationDocsHelper.SUBSCRIPTION());
  errorMsg.set(" ");
  const stringToNumber = (string) => {
    return isNaN(+string) ? 0 : +string;
  };

  function changeFlag(disable, msg = "") {
    if (disable) {
      spinnersAmount.update((n) => n + 1);
    } else {
      spinnersAmount.update((n) => n - 1);
    }
    if (msg) {
      errorMsg.set(msg);
    }
    return disable;
  }

  const addSong = async () => {
    if (
      !tableInfo.name ||
      !tableInfo.author ||
      !tableInfo.genre ||
      !tableInfo.listenings
    ) {
      addDisableFlag = changeFlag(false, "Adding empty values is not allowed!");
      return;
    }
    addDisableFlag = changeFlag(true);
    try {
      if (stringToNumber(tableInfo.listenings) <= 0) {
        throw "Listenings should be positive numbers!";
      }
      await http.startExecuteMyMutation(
        OperationDocsHelper.MUTATION_INSERT_ONE(
          tableInfo.name,
          tableInfo.author,
          tableInfo.genre,
          stringToNumber(tableInfo.listenings),
        ),
      );
    } catch (err) {
      addDisableFlag = changeFlag(false, `Error -> ${err}`);
      return;
    }
    addDisableFlag = changeFlag(false, " ");
  };

  const deleteSong = async () => {
    if (!tableInfo.name || !tableInfo.author) {
      deleteDisableFlag = changeFlag(
        false,
        "Deleting empty values is not allowed!",
      );
      return;
    }
    if (tableInfo.genre || tableInfo.listenings) {
      deleteDisableFlag = changeFlag(
        false,
        "Genre and listenings should be empty!",
      );
      return;
    }
    deleteDisableFlag = changeFlag(true);
    try {
      await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_DELETE(), {
        name: tableInfo.name,
        author: tableInfo.author,
      });
    } catch (err) {
      deleteDisableFlag = changeFlag(false, `Error -> ${err}`);
      return;
    }
    deleteDisableFlag = changeFlag(false, " ");
  };
</script>

<main>
  {#if $music.loading}
    <h1>loading ...</h1>
    <Jumper size="60" color="#FF3E00" />
  {:else if $music.error}
    <h1>Error!</h1>
  {:else if $music.data}
    <div>
      <input bind:value={tableInfo.name} placeholder="Name" />
      <input bind:value={tableInfo.author} placeholder="Author" />
      <input bind:value={tableInfo.genre} placeholder="Genre" />
      <input bind:value={tableInfo.listenings} placeholder="Listenings" />
    </div>
    <div>
      <button on:click={addSong} disabled={addDisableFlag}>Add song</button>
      <button on:click={deleteSong} disabled={deleteDisableFlag}
        >Delete song</button
      >
    </div>
    <table border="2">
      <caption>Music</caption>
      <tr>
        <th>Name</th>
        <th>Author</th>
        <th>Listenings</th>
        <th>Genre</th>
      </tr>
      {#each $music.data.lab3_music as song (song.id)}
        <tr>
          <td>{song.name}</td>
          <td>{song.author}</td>
          <td>{song.listenings}</td>
          <td>{song.genre}</td>
        </tr>
      {/each}
    </table>
    <p>{errorValue}</p>
    <div style="visibility:{spinnervalue > 0 ? 'visible' : 'hidden'}">
      <Jumper size="60" color="#FF3E00" />
    </div>
  {/if}
</main>

<style>
  main {
    margin: 0;
  }
</style>
