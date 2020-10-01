import { DeployDAO as DeployDAOEvent } from "../../../generated/DAOFactory@0.8.1/DAOFactory";
import * as aragon from "../aragon";

export function handleNewEaglet(event: DeployDAOEvent): void {
  aragon.processOrg(event.params.dao);
}
