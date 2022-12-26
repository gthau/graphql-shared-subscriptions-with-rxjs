# graphql-shared-subscriptions-with-rxjs

A sample repo to demonstrate how to share "expensive" graphql subscriptions using RXJS.
This repo uses GraphQL Yoga to easily bootstrap an all-batteries included GraphQL server.

To use it:
- clone the repo
- run `yarn install`
- run `yarn dev` or `yarn start`
- go to [GraphiQL playground](http://localhost:4000) on 2 different tabs/windows
- run subscription in first tab:
```gql
subscription mySubscription {
  mySubscription(entityId:123)
}
```
- a few seconds later run subscription in second tab
- --> the second subscription get the same values as the first one
- unsubscribe from both
- --> 10 seconds later the shared publisher is removed from cache
