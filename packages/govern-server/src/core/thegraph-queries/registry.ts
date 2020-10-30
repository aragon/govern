import gql from 'graphql-tag'

const RegistryBase = gql`
  fragment RegistryBase on RegistryEntry {
    id
    name
    queue {
      id
    }
    executor {
      id
    }
  }
`

export const QUERY_REGISTRY_ENTRY = gql`
  query RegistryEntry($name: String!) {
    registryEntry(id: $name) {
      ...RegistryBase
    }
  }
  ${RegistryBase}
`

export const QUERY_REGISTRY_ENTRIES = gql`
  query RegistryEntry {
    registryEntries {
      ...RegistryBase
    }
  }
  ${RegistryBase}
`
