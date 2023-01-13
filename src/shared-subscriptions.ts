import { finalize, interval, Observable, share, timer } from 'rxjs';
import { getOrCreatePublisher } from './utils';

const publishersMap = new Map<number, Observable<number>>();

export const giveMeIntsPublisher = getOrCreatePublisher(publishersMap, makeGiveMeIntsPublisher);

function makeGiveMeIntsPublisher(id: number): Observable<number> {
  return interval(1000).pipe(
    // clean up publisher cache when no more subscribers to this publisher
    finalize(() => {
      console.debug(`Shared publisher for id=${id} has been unsubscribed, clearing it from cache`);
      publishersMap.delete(id);
    }),
    share({
      // when no more subscribers, wait 10 seconds to unsubscribe from the source and reset the underlying subject
      resetOnRefCountZero: () => timer(10_000),
    }),
  );
}
