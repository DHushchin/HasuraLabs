import { errorMsg } from "./store";

class RequestHelper {
  constructor() {
    this.API_ROOT = API_URL;
  }

  async fetchGraphQL(operationsDoc, operationName, variables) {
    return fetch(this.API_ROOT, {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    }).then((response) => response.json());
  }

  fetchMyQuery(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async startFetchMyQuery(operationsDoc) {
    const { errors, data } = await this.fetchMyQuery(operationsDoc);

    if (errors) {
      throw errors[0].message;
    }

    return data;
  }

  executeMyMutation(operationsDoc, variables = {}) {
    return this.fetchGraphQL(operationsDoc, "MyMutation", variables);
  }

  async startExecuteMyMutation(operationsDoc, variables = {}) {
    const { errors, data } = await this.executeMyMutation(
      operationsDoc,
      variables,
    );

    if (errors) {
      throw errors[0].message;
    }

    return data;
  }
}

export default new RequestHelper();
