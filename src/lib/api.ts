import {
  Policy,
  PolicyCreateInput,
  ProvisioningStep,
  RevocationStep,
} from "../types/policy.types";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  description?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
}

export interface App {
  id: string;
  name: string;
  url?: string;
  logo?: string;
  owner?: User;
}

const API_BASE_URL = "http://localhost:3000/api";

export async function fetchPolicies(userId?: string | null): Promise<Policy[]> {
  let url = `${API_BASE_URL}/policies`;
  if (userId) {
    url += `?userId=${encodeURIComponent(userId)}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch policies: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching policies:", error);
    throw error;
  }
}

export async function fetchPolicy(id: string): Promise<Policy> {
  try {
    const response = await fetch(`${API_BASE_URL}/policies/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch policy: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching policy:", error);
    throw error;
  }
}

export async function createPolicy(policy: PolicyCreateInput): Promise<Policy> {
  try {
    const response = await fetch(`${API_BASE_URL}/policies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policy),
    });
    if (!response.ok) {
      throw new Error(`Failed to create policy: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating policy:", error);
    throw error;
  }
}

export async function updatePolicy(
  id: string,
  updates: Partial<Policy>
): Promise<Policy> {
  try {
    const response = await fetch(`${API_BASE_URL}/policies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`Failed to update policy: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating policy:", error);
    throw error;
  }
}

export async function deletePolicy(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/policies/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete policy: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting policy:", error);
    throw error;
  }
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function fetchGroups(): Promise<Group[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
}

export async function addUserToPolicy(
  policyId: string,
  userId: string
): Promise<Policy> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/policies/${policyId}/users/${userId}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to add user to policy: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding user to policy:", error);
    throw error;
  }
}

export async function removeUserFromPolicy(
  policyId: string,
  userId: string
): Promise<Policy> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/policies/${policyId}/users/${userId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to remove user from policy: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error removing user from policy:", error);
    throw error;
  }
}

export async function addGroupToPolicy(
  policyId: string,
  groupId: string
): Promise<Policy> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/policies/${policyId}/groups/${groupId}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to add group to policy: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding group to policy:", error);
    throw error;
  }
}

export async function removeGroupFromPolicy(
  policyId: string,
  groupId: string
): Promise<Policy> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/policies/${policyId}/groups/${groupId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to remove group from policy: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error removing group from policy:", error);
    throw error;
  }
}

export async function fetchApps(): Promise<App[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/apps`);
    if (!response.ok) {
      throw new Error(`Failed to fetch apps: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching apps:", error);
    throw error;
  }
}

export async function fetchApp(id: string): Promise<App> {
  try {
    const response = await fetch(`${API_BASE_URL}/apps/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch app: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching app:", error);
    throw error;
  }
}

export async function testIntegration(
  provider: string,
  stepType: string,
  config: {
    target: string;
    parameters?: Record<string, unknown>;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/integrations/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider,
        stepType,
        config,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to test integration: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error testing integration:", error);
    throw error;
  }
}

export async function testProvisioningIntegration(
  step: ProvisioningStep
): Promise<{ success: boolean; message: string }> {
  return testIntegration(step.provider, step.type, {
    target: step.target,
    parameters: step.parameters,
  });
}

export async function testRevocationIntegration(
  step: RevocationStep
): Promise<{ success: boolean; message: string }> {
  return testIntegration(step.provider, step.type, {
    target: step.target,
    parameters: step.parameters,
  });
}
