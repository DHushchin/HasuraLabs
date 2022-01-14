<script>
  import http from "./helpers/request-helper";
  import { OperationDocsHelper } from "./helpers/operation-docs-helper";
  import { ApolloClient, InMemoryCache } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { Circle3 } from "svelte-loading-spinners";
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

  let addDisableFlag = false,
    deleteDisableFlag = false;
  const tableInfo = {};
  let form;

  const client = createApolloClient();
  setClient(client);

  const music = subscribe(OperationDocsHelper.SUBSCRIPTION());

  const stringToNumber = (string) => {
    return isNaN(+string) ? 0 : +string;
  };

  function changeFlag(disable, msg = "") {
    disable ? $spinnersAmount++ : $spinnersAmount--;
    if (msg) {
      $errorMsg = msg;
    }
    return disable;
  }

  const addSong = async () => {
    addDisableFlag = changeFlag(true);

    if (
      !tableInfo.name ||
      !tableInfo.author ||
      !tableInfo.genre ||
      !tableInfo.listenings
    ) {
      addDisableFlag = changeFlag(false, "Adding empty values is not allowed!");
      return;
    }

    if (tableInfo.id) {
      addDisableFlag = changeFlag(false, "ID is generated automatically!");
      return;
    }

    try {
      if (stringToNumber(tableInfo.listenings) <= 0) {
        throw "Listenings should be positive numbers!";
      }
      await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_INSERT(), {
        name: tableInfo.name,
        author: tableInfo.author,
        genre: tableInfo.genre,
        listenings: stringToNumber(tableInfo.listenings),
      });
    } catch (err) {
      addDisableFlag = changeFlag(false, `Error -> ${err}`);
    } finally {
      form.reset();
      for (let member in tableInfo) tableInfo[member] = "";
    }

    addDisableFlag = changeFlag(false, " ");
  };

  const deleteSong = async (removeId) => {
    deleteDisableFlag = changeFlag(true);
    try {
      await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_DELETE(), {
        id: removeId,
      });
    } catch (err) {
      deleteDisableFlag = changeFlag(false, `Error -> ${err}`);
    }
    deleteDisableFlag = changeFlag(false, " ");
  };
</script>

<main>
  {#if $music.loading}
    <h1>loading ...</h1>
    <Circle3 />
  {:else if $music.error}
    <h1>Error!</h1>
  {:else if $music.data}
    <form bind:this={form}>
      <input bind:value={tableInfo.name} placeholder="Name" />
      <input bind:value={tableInfo.author} placeholder="Author" />
      <input bind:value={tableInfo.genre} placeholder="Genre" />
      <input bind:value={tableInfo.listenings} placeholder="Listenings" />
    </form>
    <div>
      <button on:click={addSong} disabled={addDisableFlag}>Add song</button>
    </div>
    {#if $music.data.lab3_music?.length}
      <table border="2">
        <caption><h2>Your playlist!</h2></caption>
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
            <td>
              <button
                on:click={() => deleteSong(song.id)}
                disabled={deleteDisableFlag}>Delete song</button
              >
            </td>
          </tr>
        {/each}
      </table>
    {:else}
      <h2>Your playlist is empty. Add something!</h2>
    {/if}
    <p>{$errorMsg}</p>
    <div class="spinner" class:visible={!$spinnersAmount}>
      <Circle3 />
    </div>
  {/if}
</main>

<style>
  main {
    margin: 0;
  }

  .visible {
    visibility: hidden;
  }
</style>
