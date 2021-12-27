import { gql } from "@apollo/client";

export class OperationDocsHelper {
  static QUERY_GET_ALL = () => `
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

  static MUTATION_INSERT_ONE = (name, author, genre, listenings) => `
  mutation MyMutation {
    insert_lab3_music(objects: {name: "${name}", author: "${author}", listenings: ${listenings}, genre: "${genre}"}) {
      returning {
        id
        name
        author
        listenings
        genre
      }
    }
   }
  `;

  static MUTATION_DELETE = () => `
  mutation MyMutation($name: String, $author: String) {
    delete_lab3_music(where: {name: {_eq: $name}, _and: {author: {_eq: $author}}}) {
      returning {
        id
        name
        author
        listenings
        genre
      }
    }
  }
  `;

  static SUBSCRIPTION = gql`
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
