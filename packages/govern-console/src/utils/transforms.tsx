export function transformProposalDetails(data: any) {
  return data;
}

export function transformProposals(data: any) {
  return data;
}

export function transformDaoDetails(data: any) {
  const daos = data.daos;
  if (daos.length == 0) {
    return null;
  }

  data = daos[0];

  return data;
}

export function transformFinance(data: any) {
  data = data.govern;
  return data;
}
