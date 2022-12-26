import { createSchema } from 'graphql-yoga';
import { finalize } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';
import { getPublisher } from './shared-subscriptions';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String
    }
    type Subscription {
      mySubscription(entityId: ID!): Int!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'world',
    },
    Subscription: {
      mySubscription: {
        subscribe(source, { entityId }, context) {
          const userId = context.request.headers.get('user-id');
          return eachValueFrom(
            getPublisher(entityId).pipe(
              finalize(() => console.debug(`Subscription for [userId=${userId};entityId=${entityId}] has ended`)),
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
