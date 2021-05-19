import { toMs } from 'utils/date';

export function transformProposalDetails(data: any) {
  return {
    ...data,
    container: {
      ...data.container,
      createdAt: toMs(data.container.createdAt),
      payload: {
        ...data.container.payload,
        executionTime: toMs(data.container.payload.executionTime),
      },
      history: data.container.history.map((item: any) => {
        return {
          ...item,
          createdAt: toMs(item.createdAt),
        };
      }),
    },
  };
}

export function transformProposals(data: any) {
  return {
    ...data,
    governQueue: {
      ...data.governQueue,
      containers: data.governQueue.containers.map((item: any) => {
        return {
          ...item,
          createdAt: toMs(item.createdAt),
        };
      }),
    },
  };
}
