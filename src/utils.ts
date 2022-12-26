export const getOrCreatePublisher = <TEntityId, TPublisher>(
  publishers: Map<TEntityId, TPublisher>,
  makePublisherFn: (entityId: TEntityId) => TPublisher,
) => (entityId: TEntityId) => {
  if (publishers.has(entityId)) {
    return publishers.get(entityId)!;
  }

  const newPublisher = makePublisherFn(entityId);
  publishers.set(entityId, newPublisher);
  return newPublisher;
};
