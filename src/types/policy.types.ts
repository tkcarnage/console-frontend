export type AccessDurationType = "FIXED" | "INDEFINITE";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  title?: string;
  department?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface App {
  id: string;
  name: string;
  url?: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  ownerId?: string;
}

export interface ApprovalStep {
  id: string;
  type: "app_owner" | "specific";
  escalate: boolean;
  userIds?: string[];
}

export interface ProvisioningStep {
  id: string;
  type: string;
  target: string;
  provider: string;
  apiEndpoint?: string;
  parameters?: Record<string, unknown>;
  description?: string;
}

export interface RevocationStep {
  id: string;
  type: string;
  target: string;
  provider: string;
  apiEndpoint?: string;
  parameters?: Record<string, unknown>;
  description?: string;
}

export interface Policy {
  id: string;
  name: string;
  description?: string;
  appId: string;
  app: App;
  visibleToEveryone: boolean;
  visibleGroups?: Group[];
  visibleUsers?: User[];
  visibleGroupIds?: string[];
  visibleUserIds?: string[];
  accessDurationType: AccessDurationType;
  accessDurationDays?: number;
  useAppOwnerAsReviewer: boolean;
  approvalSteps?: ApprovalStep[];
  provisioningSteps?: ProvisioningStep[];
  revocationSteps?: RevocationStep[];
  reviewers?: User[];
  reviewerIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface PolicyCreateInput {
  name: string;
  description?: string;
  appId: string;
  visibleToEveryone?: boolean;
  visibleUserIds?: string[];
  visibleGroupIds?: string[];
  accessDurationType: AccessDurationType;
  accessDurationDays?: number;
  reviewerIds?: string[];
  useAppOwnerAsReviewer?: boolean;
  provisioningSteps?: ProvisioningStep[];
  revocationSteps?: RevocationStep[];
  approvalSteps?: ApprovalStep[];
}

export interface PolicyUpdateInput extends Partial<PolicyCreateInput> {
  id: string;
}
