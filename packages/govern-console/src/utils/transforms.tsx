import { toMs } from 'utils/date';
import { correctDecimal } from 'utils/token';

export async function transformProposalDetails(data: any, provider: any) {
  return {
    ...data,
    container: {
      ...data.container,
      config: {
        ...data.container.config,
        scheduleDeposit: {
          ...data.container.config.scheduleDeposit,
          amount: await correctDecimal(
            data.container.config.scheduleDeposit.token,
            data.container.config.scheduleDeposit.amount,
            false,
            provider,
          ),
        },
        challengeDeposit: {
          ...data.container.config.challengeDeposit,
          amount: await correctDecimal(
            data.container.config.challengeDeposit.token,
            data.container.config.challengeDeposit.amount,
            false,
            provider,
          ),
        },
      },
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
          payload: {
            ...item.payload,
            executionTime: toMs(item.payload.executionTime),
          },
        };
      }),
    },
  };
}

export async function transformDaoDetails(data: any, provider: any) {
  const daos = data.daos;
  if (daos.length == 0) {
    return null;
  }

  data = daos[0];

  return {
    ...data,
    queue: {
      ...data.queue,
      config: {
        ...data.queue.config,
        scheduleDeposit: {
          ...data.queue.config.scheduleDeposit,
          amount: await correctDecimal(
            data.queue.config.scheduleDeposit.token,
            data.queue.config.scheduleDeposit.amount,
            false,
            provider,
          ),
        },
        challengeDeposit: {
          ...data.queue.config.challengeDeposit,
          amount: await correctDecimal(
            data.queue.config.challengeDeposit.token,
            data.queue.config.challengeDeposit.amount,
            false,
            provider,
          ),
        },
      },
    },
  };
}
