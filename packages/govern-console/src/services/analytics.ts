enum MethodType {
  PAGE,
  IDENTIFY,
  EVENT,
}

// TODO: define tracked Events
export enum EventType {
  WALLET_DISCONNECTED = 'wallet_disconnected',
  DEPOSIT_ASSETS_ClICKED = 'deposit_assets_clicked',
  DAO_CREATEBTN_CLICKED = 'dao_createBtn_clicked',
  DAO_CREATED = 'dao_created',
  DAO_CREATIONFAILED = 'dao_creationFailed',
  NAVBAR_CREATEDAO_CLICKED = 'navbar_createDAO_clicked',
}

/**
 * This private method extracts the necessary method from the global window object.
 *
 * @param methodType Type of analyts to track
 * @returns the corresponding analytics method
 */
function getAnalyticsMethod(methodType: MethodType) {
  const windowAnalytics = (window as any).rudderanalytics;
  if (!windowAnalytics) {
    return;
  }
  if (methodType === MethodType.PAGE) return windowAnalytics.page;
  if (methodType === MethodType.IDENTIFY) return windowAnalytics.identify;
  if (methodType === MethodType.EVENT) return windowAnalytics.track;
}

/**
 * This method keeps track of certain events (like creation of proposals, etc.).
 *
 * @param eventName name of the event to be tracked
 * @param data data relating to tracked event
 * @returns void
 */
export function trackEvent<T>(eventType: EventType, eventData: T) {
  const trackerMethod = getAnalyticsMethod(MethodType.EVENT);
  if (typeof trackerMethod !== 'function') {
    return;
  }
  trackerMethod(eventType, eventData);
}

/**
 * Sends analytics informations about the pages visited.
 *
 * @param pathName (Dynamic) Path name as given by the nextjs router.
 * @returns void
 */
export function trackPage(pathName: string) {
  const trackerMethod = getAnalyticsMethod(MethodType.PAGE);
  if (typeof trackerMethod !== 'function') {
    return;
  }
  trackerMethod({
    path: pathName,
  });
}

/**
 * Sends analytics informations about the connected wallets.
 *
 * @param account Wallet address
 * @param networkName Name of the ethereum network the wallet is connected to
 * @param connector Wallet connector used by use-wallet library
 * @returns void
 */
export function identifyUser(account: string, networkName: string, connector: string) {
  const trackerMethod = getAnalyticsMethod(MethodType.IDENTIFY);
  if (typeof trackerMethod !== 'function') {
    return;
  }

  const walletData = {
    wallet_address: account,
    wallet_provider: connector,
    network: networkName,
  };

  trackerMethod(walletData);
}
