import { gql } from "@apollo/client";

export class OperationDocsHelper {
  static QUERY_GET_All() {
    return `
    query MyQuery {
      lab3_music {
        author
        genre
        id
        listenings
        name
      }
    }
  `;
  }

  static MUTATION_INSERT() {
    return `
    mutation MyMutation($genre: String, $author: String, $name: String, $listenings: Int) {
      insert_lab3_music_one(object: {author: $author, genre: $genre, name: $name, listenings: $listenings}) {
        author
        genre
        id
        listenings
        name
      }
    }
  `;
  }

  static MUTATION_DELETE() {
    return `
    mutation MyMutation($id: Int) {
      delete_lab3_music(where: {id: {_eq: $id}}) {
        returning {
          author
          genre
          id
          listenings
          name
        }
      }
    }
  `;
  }

  static SUBSCRIPTION() {
    return gql`
      subscription MySubscription {
        lab3_music {
          id
          name
          author
          listenings
          genre
        }
      }
    `;
  }
}
