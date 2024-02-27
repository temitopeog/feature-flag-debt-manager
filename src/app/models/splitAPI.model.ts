export interface URN {
  id: string;
  name: string;
}

export interface splitGeneric {
  objects: featureFlag[], // Array of feature flags returned
  offset: number, // Offset received
  limit: number, // Limit received
  totalCount: number, // Total number of feature flags
}

export interface featureFlag {
  name: string,
  description: string,
  trafficType: URN, // Containing id and name of the traffic type
  creationTime: Date, // Milliseconds since epoch
  id: string, //ID of the feature flag
  tags: TagsObject[], // Tag contains name: String
  rolloutStatus: URN,
  owners: ownersObject[], // Array of owners
  rolloutStatusTimestamp: Date // Milliseconds since epoch
}

export interface ownersObject {
  id: string;
  type: string;
}

export interface TagsObject {
  name: string;
}

export interface User {
  id: string;
  type: string;
  name: string;
  email: string;
  status: string;
  groups: ownersObject[];
}

