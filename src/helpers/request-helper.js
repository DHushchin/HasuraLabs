import { errorMsg } from "./store";

class RequestHelper {
  constructor() {
    this.API_URL = API_ROOT;
  }

  async fetchGraphQL(operationsDoc, operationName, variables) {
    return fetch(this.API_URL, {
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
      errorMsg.set(`Error -> ${errors}`);
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
      errorMsg.set(`Error -> ${errors}`);
    }

    return data;
  }
}

export default new RequestHelper();
