import { createSchema } from 'graphql-yoga';
import { finalize } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';
import { giveMeEvenIntsPublisher, giveMeIntsPublisher } from './shared-subscriptions';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String
    }
    type Subscription {
      giveMeInts(id: ID!): Int!
      giveMeEvenInts(id: ID!): Int!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'world',
    },
    Subscription: {
      giveMeInts: {
        subscribe(source, { id }, context) {
          const userId = context.request.headers.get('user-id');
          return eachValueFrom(
            giveMeIntsPublisher(id).pipe(
              finalize(() => console.debug(`Subscription giveMeInts for ${JSON.stringify({ userId, id })} has ended`)),
            )
          );
        },
        resolve(source, args, context) {
          return source;
        }
      },
      giveMeEvenInts: {
        subscribe(source, { id }, context) {
          const userId = context.request.headers.get('user-id');
          return eachValueFrom(
            giveMeEvenIntsPublisher(id).pipe(
              finalize(() => console.debug(`Subscription giveMeEvenInts for ${JSON.stringify({ userId, id })} has ended`)),
            )
          );
        },
        resolve(source, args, context) {
          return source;
        }
      }
    },
  }
});
