export type AccessDurationType = "INDEFINITE" | "FIXED" | "USER_REQUESTED";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface App {
  id: string;
  name: string;
  logo: string;
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
  app: {
    id: string;
    name: string;
    logo?: string;
  };
  visibleToEveryone: boolean;
  visibleGroups?: Array<{ id: string; name: string }>;
  visibleUsers?: Array<{ id: string; name: string; email: string }>;
  requireReason?: boolean;
  accessDurationType: AccessDurationType;
  accessDurationDays?: number;
  minDays?: number;
  maxDays?: number;
  approvalSteps?: ApprovalStep[];
  provisioningSteps?: ProvisioningStep[];
  revocationSteps?: RevocationStep[];
  reviewers?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  useAppOwnerAsReviewer?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PolicyCreateInput {
  name: string;
  description?: string;
  appId: string;
  visibleToEveryone?: boolean;
  visibleUserEmails?: string[];
  visibleGroupIds?: string[];
  accessDurationType: AccessDurationType;
  accessDurationDays?: number;
  reviewerEmails?: string[];
  useAppOwnerAsReviewer?: boolean;
  provisioningSteps?: ProvisioningStep[];
  revocationSteps?: RevocationStep[];
  approvalSteps?: ApprovalStep[];
  requireReason?: boolean;
  minDays?: number;
  maxDays?: number;
}

export interface PolicyUpdateInput extends Partial<PolicyCreateInput> {
  id: string;
  visibleGroupIds?: string[];
  visibleUserIds?: string[];
}
