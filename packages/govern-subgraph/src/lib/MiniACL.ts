import { Address, Bytes } from "@graphprotocol/graph-ts";
import { Role as RoleEntity } from "../../generated/schema";

export function frozenRoles(roles: string[], selector: Bytes): void {
  roles
    .map<RoleEntity>((role) => RoleEntity.load(role)!)
    .filter((role) => role.selector === selector)
    .forEach((role) => {
      role.frozen = true;
      role.save();
    });
}

export function roleGranted(
  entity: Address,
  selector: Bytes,
  who: Address
): RoleEntity {
  const role = loadOrCreateRole(entity, selector, who);
  role.granted = true;

  role.save();

  return role;
}

export function roleRevoked(
  entity: Address,
  selector: Bytes,
  who: Address
): RoleEntity {
  const role = loadOrCreateRole(entity, selector, who);
  role.granted = false;

  role.save();

  return role;
}

function buildRoleId(entity: Address, selector: Bytes, who: Address): string {
  // roleID = entity address + role itself,
  // which will be the function selector + who
  // This is equivalent to storing all roles in the contract, and looking up the corresponding
  // entry by mapping role => who
  return (
    entity.toHexString() +
    "-selector-" +
    selector.toHexString() +
    "-who-" +
    who.toHexString()
  );
}

function loadOrCreateRole(
  entity: Address,
  selector: Bytes,
  who: Address
): RoleEntity {
  const roleId = buildRoleId(entity, selector, who);
  // Create role
  let role = RoleEntity.load(roleId);
  if (role === null) {
    role = new RoleEntity(roleId);
    role.entity = entity;
    role.selector = selector;
    role.who = who;
    role.granted = false;
    role.frozen = false;
  }
  return role!;
}
