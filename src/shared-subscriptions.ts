import { finalize, interval, Observable, share, timer } from 'rxjs';
import { getOrCreatePublisher } from './utils';

const publishersMap = new Map<number, Observable<number>>();

export const getPublisher = getOrCreatePublisher(publishersMap, makePublisher);

function makePublisher(entityId: number): Observable<number> {
  return interval(1000).pipe(
    // clean up publisher cache when no more subscribers to this publisher
    finalize(() => {
      console.debug(`Shared publisher for entityId=${entityId} has been unsubscribed, clearing it from cache`);
      publishersMap.delete(entityId);
    }),
    share({
      // when no more subscribers, wait 10 seconds to unsubscribe from the source and reset the underlying subject
      resetOnRefCountZero: () => timer(10_000),
    }),
  );
}
