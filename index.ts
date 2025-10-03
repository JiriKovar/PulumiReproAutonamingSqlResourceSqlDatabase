import * as azurenative from "@pulumi/azure-native";

// Create a resource group
const resourceGroup = new azurenative.resources.ResourceGroup("repro-rg", {
  location: "westus2",
});

// Create a CosmosDB Database Account with SQL API
const databaseAccount = new azurenative.cosmosdb.DatabaseAccount("repro-cosmosdb", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  databaseAccountOfferType: "Standard",
  locations: [{
    locationName: resourceGroup.location,
    failoverPriority: 0,
    isZoneRedundant: false,
  }],
  consistencyPolicy: {
    defaultConsistencyLevel: "Session",
  },
  capabilities: [{
    name: "EnableServerless",
  }],
});

// Create a SQL Database
const sqlDatabase = new azurenative.cosmosdb.SqlResourceSqlDatabase("repro-db", {
  resourceGroupName: resourceGroup.name,
  accountName: databaseAccount.name,
  resource: {
    id: "repro-db",
  },
});

// Export the connection strings and endpoints
export const cosmosDbEndpoint = databaseAccount.documentEndpoint;
export const cosmosDbAccountName = databaseAccount.name;
export const sqlDatabaseName = sqlDatabase.name;
