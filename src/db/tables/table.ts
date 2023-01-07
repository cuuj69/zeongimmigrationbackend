import {INDEX_TYPE, Table} from "@typedorm/common";

const zeongTable = new Table({
  name: "zeongTable",
  partitionKey: "PK",
  sortKey: "SK",
});

export default zeongTable;
