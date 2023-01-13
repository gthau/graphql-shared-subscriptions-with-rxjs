import { filter, finalize, interval, Observable, share, timer } from 'rxjs';
import { getOrCreatePublisher } from './utils';

const giveMeIntsPublishersMap = new Map<number, Observable<number>>();
const giveMeEvenIntsPublishersMap = new Map<number, Observable<number>>();

export const giveMeIntsPublisher = getOrCreatePublisher(giveMeIntsPublishersMap, makeGiveMeIntsPublisher);
export const giveMeEvenIntsPublisher = getOrCreatePublisher(giveMeEvenIntsPublishersMap, makeGiveMeEvenIntsPublisher);

function makeGiveMeIntsPublisher(id: number): Observable<number> {
  return interval(1000).pipe(
    // clean up publisher cache when no more subscribers to this publisher
    finalize(() => {
      console.debug(`Shared giveMeIntsPublisher for id=${id} has been unsubscribed, clearing it from cache`);
      giveMeIntsPublishersMap.delete(id);
    }),
    share({
      // when no more subscribers, wait 10 seconds to unsubscribe from the source and reset the underlying subject
      resetOnRefCountZero: () => timer(10_000),
    }),
  );
}

function makeGiveMeEvenIntsPublisher(id: number): Observable<number> {
  return giveMeIntsPublisher(id).pipe(
    filter((item) => item % 2 === 0),
    // clean up publisher cache when no more subscribers to this publisher
    finalize(() => {
      console.debug(`Shared giveMeEvenIntsPublisher for id=${id} has been unsubscribed, clearing it from cache`);
      giveMeEvenIntsPublishersMap.delete(id);
    }),
    share({
      // when no more subscribers, wait 10 seconds to unsubscribe from the source and reset the underlying subject
      resetOnRefCountZero: () => timer(10_000),
    }),
  );
}
