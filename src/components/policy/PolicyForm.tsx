import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Save, FileText, CheckCircle, UserPlus, UserMinus } from "lucide-react";
import { ProvisioningStep, RevocationStep, AccessDurationType, Policy, User, ApprovalStep, Group } from '../../types/policy.types';
import { fetchUsers, fetchGroups } from '@/lib/api';
import PolicyMetadataForm from './PolicyMetadataForm';
import PolicyDetailsSection from './PolicyDetailsSection';
import AppSelector from './AppSelector';
import ApprovalStepsSection from './ApprovalStepsSection';
import ProvisioningStepsSection from './ProvisioningStepsSection';
import RevocationStepsSection from './RevocationStepsSection';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Helper function to generate unique IDs
const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
interface ApprovalStepUI extends ApprovalStep {
  selectedUserIds?: string[]; 
}

interface App {
  id: string;
  name: string;
  logo?: string;
}

interface PolicyFormProps {
  apps: App[];
  loading: boolean;
  error: string | null;
  onSubmit: (policyData: Policy) => Promise<void>;
  submitting: boolean;
  initialData?: Partial<Policy>;
  readOnly?: boolean;
}

export default function PolicyForm({ 
  apps, 
  loading: initialLoading,
  error: initialError,
  onSubmit, 
  submitting, 
  initialData,
  readOnly = false,
}: PolicyFormProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState("details");

  // Form state
  const [policyName, setPolicyName] = useState<string>(initialData?.name || '');
  const [policyDescription, setPolicyDescription] = useState<string>(initialData?.description || '');
  const [selectedAppId, setSelectedAppId] = useState<string>(initialData?.appId || (apps.length > 0 ? apps[0].id : ''));
  const [policyVisibility, setPolicyVisibility] = useState<string>(initialData?.visibleToEveryone ? "everyone" : "specific");
  const [accessLength, setAccessLength] = useState<string>(initialData?.accessDurationType || "INDEFINITE");
  const [accessDurationDays, setAccessDurationDays] = useState<number>(initialData?.accessDurationDays || 30);
  const [useAppOwnerAsReviewer, setUseAppOwnerAsReviewer] = useState<boolean>(
    initialData?.useAppOwnerAsReviewer !== undefined ? initialData.useAppOwnerAsReviewer : true
  );
  const [selectedGroups, setSelectedGroups] = useState<Group[]>(initialData?.visibleGroups || []);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(
    initialData?.visibleUsers || []
  );
  const [provisioningSteps, setProvisioningSteps] = useState<ProvisioningStep[]>(
    initialData?.provisioningSteps || [
      { id: generateUniqueId(), type: 'add_to_group', target: 'sales', provider: 'okta', description: 'Add user to Sales group in Okta' }
    ]
  );
  
  // Add state for revocation steps
  const [revocationSteps, setRevocationSteps] = useState<RevocationStep[]>(
    initialData?.revocationSteps || [
      { id: generateUniqueId(), type: 'remove_from_group', target: 'sales', provider: 'okta', description: 'Remove user from Sales group in Okta' }
    ]
  );

  // --- New State for Reviewers ---
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [selectedReviewerIds, setSelectedReviewerIds] = useState<string[]>(
    initialData?.reviewers?.map(r => r.id) || []
  );
  const [loadingResources, setLoadingResources] = useState<boolean>(true);
  const [resourceError, setResourceError] = useState<string | null>(null);
  // --- End New State ---

  // --- State for Approval Steps ---
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStepUI[]>(
    () => {
      const initialSteps = initialData?.approvalSteps || [];
      return initialSteps.map(step => ({ ...step, selectedUserIds: step.userIds ?? [] }));
    }
  );
  // --- End Approval Steps State ---

  // --- Fetch Users Effect ---
  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoadingResources(true);
        setResourceError(null);
        const [usersData, groupsData] = await Promise.all([
          fetchUsers(),
          fetchGroups()
        ]);
        setAllUsers(usersData);
        setAllGroups(groupsData);
      } catch (err) {
        console.error("Error fetching users or groups:", err);
        setResourceError("Failed to load necessary resources.");
        setAllUsers([]);
        setAllGroups([]);
      } finally {
        setLoadingResources(false);
      }
    };
    loadResources();
  }, []);
  // --- End Fetch Users Effect ---

  // --- Handler to toggle reviewer selection ---
  const handleToggleReviewer = (userId: string) => {
    if (readOnly) return;
    setSelectedReviewerIds(prevIds => {
      if (prevIds.includes(userId)) {
        // Also remove user from any specific approval steps if they are deselected as a reviewer
        setApprovalSteps(currentSteps => 
          currentSteps.map(step => ({ 
            ...step, 
            selectedUserIds: step.type === 'specific' ? step.selectedUserIds?.filter(id => id !== userId) : step.selectedUserIds
          }))
        );
        return prevIds.filter(id => id !== userId);
      } else {
        return [...prevIds, userId];
      }
    });
  };

  // --- Handlers for Approval Steps ---
  const handleAddApprovalStep = (type: 'app_owner' | 'specific') => {
    if (readOnly) return;
    const newStep: ApprovalStepUI = {
      id: generateUniqueId(), type, escalate: false, selectedUserIds: [],
    };
    setApprovalSteps([...approvalSteps, newStep]);
  };

  const handleRemoveApprovalStep = (index: number) => {
    if (readOnly) return;
    setApprovalSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateApprovalStepType = (index: number, type: 'app_owner' | 'specific') => {
    if (readOnly) return;
    setApprovalSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, type, selectedUserIds: type === 'specific' ? step.selectedUserIds : [] } : step
    ));
  };

  const handleUpdateApprovalStepUsers = (index: number, userIds: string[]) => {
    if (readOnly) return;
    setApprovalSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, selectedUserIds: userIds } : step
    ));
  };

  const handleUpdateApprovalStepEscalate = (index: number, escalate: boolean) => {
    if (readOnly) return;
    setApprovalSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, escalate } : step
    ));
  };

  const handleResetApprovalSteps = () => {
    if (readOnly) return;
    setApprovalSteps([{ id: generateUniqueId(), type: 'app_owner', escalate: false, selectedUserIds: [] }]);
  };
  // --- End Approval Steps Handlers ---

  // Provisioning Step handlers
  const handleAddProvisioningStep = () => {
    if (readOnly) return;
    const newStep: ProvisioningStep = {
      id: generateUniqueId(), type: 'add_to_group', target: 'sales', provider: 'okta', description: 'Add user to group'
    };
    setProvisioningSteps([...provisioningSteps, newStep]);
  };

  const handleRemoveProvisioningStep = (index: number) => {
    if (readOnly) return;
    setProvisioningSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetProvisioningSteps = () => {
    if (readOnly) return;
    setProvisioningSteps([{ id: generateUniqueId(), type: 'add_to_group', target: 'sales', provider: 'okta', description: 'Add user to Sales group in Okta' }]);
  };

  const handleUpdateProvisioningStep = (index: number, field: keyof ProvisioningStep, value: string) => {
    if (readOnly) return;
    setProvisioningSteps(prev => prev.map((step, i) => i === index ? { ...step, [field]: value } : step));
  };

  // Revocation step handlers
  const handleAddRevocationStep = () => {
    if (readOnly) return;
    const newStep: RevocationStep = {
      id: generateUniqueId(), type: 'remove_from_group', target: 'sales', provider: 'okta', description: 'Remove user from group'
    };
    setRevocationSteps([...revocationSteps, newStep]);
  };

  const handleRemoveRevocationStep = (index: number) => {
    if (readOnly) return;
    setRevocationSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetRevocationSteps = () => {
    if (readOnly) return;
    setRevocationSteps([{ id: generateUniqueId(), type: 'remove_from_group', target: 'sales', provider: 'okta', description: 'Remove user from Sales group in Okta' }]);
  };

  const handleUpdateRevocationStep = (index: number, field: keyof RevocationStep, value: string) => {
    if (readOnly) return;
    setRevocationSteps(prev => prev.map((step, i) => i === index ? { ...step, [field]: value } : step));
  };

  // Provider and description handlers
  const handleUpdateProvisioningStepProvider = (index: number, provider: string) => {
    if (readOnly) return;
    setProvisioningSteps(prev => prev.map((step, i) => i === index ? { ...step, provider } : step));
  };

  const handleUpdateRevocationStepProvider = (index: number, provider: string) => {
    if (readOnly) return;
    setRevocationSteps(prev => prev.map((step, i) => i === index ? { ...step, provider } : step));
  };

  const handleUpdateProvisioningStepDescription = (index: number, description: string) => {
    if (readOnly) return;
    setProvisioningSteps(prev => prev.map((step, i) => i === index ? { ...step, description } : step));
  };

  const handleUpdateRevocationStepDescription = (index: number, description: string) => {
    if (readOnly) return;
    setRevocationSteps(prev => prev.map((step, i) => i === index ? { ...step, description } : step));
  };

  // Group and user handlers
  const handleAddGroup = () => {
    if (readOnly) return;
    setSelectedGroups(prev => [...prev, { id: generateUniqueId(), name: "" }]);
  };

  const handleAddUser = () => {
    if (readOnly) return;
    setSelectedUsers(prev => [...prev, { id: generateUniqueId(), firstName: "", lastName: "", email: "" }]);
  };

  const handleRemoveGroup = (index: number) => {
    if (readOnly) return;
    setSelectedGroups(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUser = (index: number) => {
    if (readOnly) return;
    setSelectedUsers(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSelectedGroup = (index: number, groupId: string) => {
    if (readOnly) return;
    const group = allGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroups(prev => prev.map((g, i) => i === index ? group : g));
    }
  };

  const handleUpdateSelectedUser = (index: number, userId: string) => {
    if (readOnly) return;
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUsers(prev => prev.map((u, i) => i === index ? user : u));
    }
  };

  // --- Filter Available Reviewers --- 
  const availableReviewers = useMemo(() => {
    return allUsers.filter(user => selectedReviewerIds.includes(user.id));
  }, [allUsers, selectedReviewerIds]);
  // --- End Filter --- 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    try {
      // Validate form
      if (!policyName || !selectedAppId || !accessLength) {
        throw new Error('Please fill in all required fields');
      }

      if (
        accessLength === "FIXED" &&
        (!accessDurationDays || accessDurationDays <= 0)
      ) {
        throw new Error('Please provide a valid number of days for fixed access');
      }

      // Prepare policy data
      const policyData: Policy = {
        ...(initialData as Policy),
        id: initialData?.id || generateUniqueId(),
        name: policyName,
        description: policyDescription,
        appId: selectedAppId,
        visibleToEveryone: policyVisibility === "everyone",
        accessDurationType: accessLength as AccessDurationType,
        accessDurationDays: 
          accessLength === "FIXED" 
            ? accessDurationDays 
            : undefined,
        useAppOwnerAsReviewer,
        provisioningSteps,
        revocationSteps,
        visibleGroups: policyVisibility === "specific" ? selectedGroups.filter(g => Boolean(g.id && g.name)) : undefined,
        visibleUsers: policyVisibility === "specific"
          ? selectedUsers
              .filter(u => Boolean(u.id && u.email && u.firstName && u.lastName))
          : undefined,
        reviewers: selectedReviewerIds.map(id => {
          const reviewer = allUsers.find(u => u.id === id);
          return reviewer || { id };
        }) as User[],
        approvalSteps: approvalSteps.map(step => ({
          id: step.id,
          type: step.type,
          escalate: step.escalate,
          userIds: step.type === 'specific' ? (step.selectedUserIds || []) : undefined, 
        })),
        app: apps.find(app => app.id === selectedAppId) || { id: selectedAppId, name: "Unknown App" }
      };

      await onSubmit(policyData);
    } catch (err) {
      console.error(err);
    }
  };

  if (initialLoading || loadingResources) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-lg">Loading Form...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-8 max-w-5xl space-y-8">
      {!readOnly && (
         <div className="mb-6 flex justify-end items-center">
           <Button
             variant="default"
             size="sm"
             type="submit"
             disabled={submitting}
             className="flex items-center gap-1"
           >
             {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
             {initialData ? 'Save Changes' : 'Create Policy'} 
           </Button>
         </div>
      )}

      {initialError && (
        <div className="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
          {initialError}
        </div>
      )}
      
      {resourceError && (
         <div className="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
           {resourceError}
         </div>
       )}

      <PolicyMetadataForm 
        policyName={policyName}
        setPolicyName={setPolicyName}
        policyDescription={policyDescription}
        setPolicyDescription={setPolicyDescription}
        readOnly={readOnly} 
      />

      <AppSelector 
        apps={apps}
        selectedAppId={selectedAppId}
        setSelectedAppId={setSelectedAppId}
        readOnly={readOnly}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="details" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
            <FileText className="h-4 w-4" />
            <span>Details</span>
            {activeTab === "details" && <div className="absolute rounded-full bg-primary w-5 h-5 top-1 right-1 text-xs text-primary-foreground flex items-center justify-center">1</div>}
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
            <CheckCircle className="h-4 w-4" />
            <span>Approvals</span>
            {activeTab === "approvals" && <div className="absolute rounded-full bg-primary w-5 h-5 top-1 right-1 text-xs text-primary-foreground flex items-center justify-center">2</div>}
          </TabsTrigger>
          <TabsTrigger value="grant" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
            <UserPlus className="h-4 w-4" />
            <span>Grant access</span>
            {activeTab === "grant" && <div className="absolute rounded-full bg-primary w-5 h-5 top-1 right-1 text-xs text-primary-foreground flex items-center justify-center">3</div>}
          </TabsTrigger>
          <TabsTrigger value="revoke" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
            <UserMinus className="h-4 w-4" />
            <span>Revoke access</span>
            {activeTab === "revoke" && <div className="absolute rounded-full bg-primary w-5 h-5 top-1 right-1 text-xs text-primary-foreground flex items-center justify-center">4</div>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <PolicyDetailsSection 
            policyName={policyName}
            setPolicyName={setPolicyName}
            policyDescription={policyDescription}
            setPolicyDescription={setPolicyDescription}
            accessLength={accessLength}
            setAccessLength={setAccessLength}
            accessDurationDays={accessDurationDays}
            setAccessDurationDays={setAccessDurationDays}
            selectedGroups={selectedGroups}
            selectedUsers={selectedUsers}
            policyVisibility={policyVisibility}
            setPolicyVisibility={setPolicyVisibility}
            allGroups={allGroups}
            allUsers={allUsers}
            loadingResources={loadingResources}
            handleAddGroup={handleAddGroup}
            handleRemoveGroup={handleRemoveGroup}
            handleUpdateSelectedGroup={handleUpdateSelectedGroup}
            handleAddUser={handleAddUser}
            handleRemoveUser={handleRemoveUser}
            handleUpdateSelectedUser={handleUpdateSelectedUser}
            readOnly={readOnly}
          />
        </TabsContent>

        <TabsContent value="approvals" className="mt-0">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-2xl font-bold">Policy Reviewers</h2>
                  <p className="text-muted-foreground">Select the pool of users who can approve requests for this policy.</p>
                </div>
              </div>
              
              <Card className="border-primary/20 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="use-app-owner"
                        checked={useAppOwnerAsReviewer}
                        onCheckedChange={(checked) => !readOnly && setUseAppOwnerAsReviewer(checked === true)}
                        disabled={readOnly}
                      />
                      <div>
                        <Label htmlFor="use-app-owner">Use App Owner as Reviewer</Label>
                        <p className="text-sm text-muted-foreground">The app owner will be a reviewer for this policy</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Additional Reviewers</Label>
                      {loadingResources ? (
                        <div className="flex items-center justify-center p-4 border rounded-md">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          <span className="text-sm text-muted-foreground">Loading users...</span>
                        </div>
                      ) : resourceError ? (
                        <div className="text-sm text-destructive p-3 border border-destructive rounded-md">
                          {resourceError}
                        </div>
                      ) : allUsers.length === 0 ? (
                        <div className="text-sm text-muted-foreground p-3 border rounded-md">
                          No users available to select.
                        </div>
                      ) : (
                        <Card className="p-3 border rounded-md max-h-60 overflow-y-auto">
                          <div className="grid grid-cols-1 gap-2">
                            {allUsers.map(user => (
                              <div key={user.id} className="flex items-center space-x-2 p-2 rounded hover:bg-accent">
                                <Checkbox
                                  id={`reviewer-${user.id}`}
                                  checked={selectedReviewerIds.includes(user.id)}
                                  onCheckedChange={() => handleToggleReviewer(user.id)}
                                  disabled={readOnly}
                                />
                                <Label
                                  htmlFor={`reviewer-${user.id}`}
                                  className={`flex items-center gap-2 text-sm flex-grow ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                                    {user.firstName?.charAt(0).toUpperCase()}
                                    {user.lastName?.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-normal truncate">{user.firstName} {user.lastName}</span>
                                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ApprovalStepsSection 
              approvalSteps={approvalSteps}
              availableReviewers={availableReviewers}
              loadingReviewers={loadingResources}
              handleAddApprovalStep={handleAddApprovalStep}
              handleRemoveApprovalStep={handleRemoveApprovalStep}
              handleUpdateApprovalStepType={handleUpdateApprovalStepType}
              handleUpdateApprovalStepUsers={handleUpdateApprovalStepUsers}
              handleUpdateApprovalStepEscalate={handleUpdateApprovalStepEscalate}
              handleResetApprovalSteps={handleResetApprovalSteps}
              readOnly={readOnly}
            />
          </div>
        </TabsContent>

        <TabsContent value="grant" className="mt-0">
          <ProvisioningStepsSection 
            provisioningSteps={provisioningSteps}
            handleAddProvisioningStep={handleAddProvisioningStep}
            handleRemoveProvisioningStep={handleRemoveProvisioningStep}
            handleUpdateProvisioningStep={handleUpdateProvisioningStep}
            handleUpdateProvisioningStepProvider={handleUpdateProvisioningStepProvider}
            handleUpdateProvisioningStepDescription={handleUpdateProvisioningStepDescription}
            handleResetProvisioningSteps={handleResetProvisioningSteps}
            readOnly={readOnly}
          />
        </TabsContent>

        <TabsContent value="revoke" className="mt-0">
          <RevocationStepsSection 
            revocationSteps={revocationSteps}
            handleAddRevocationStep={handleAddRevocationStep}
            handleRemoveRevocationStep={handleRemoveRevocationStep}
            handleUpdateRevocationStep={handleUpdateRevocationStep}
            handleUpdateRevocationStepProvider={handleUpdateRevocationStepProvider}
            handleUpdateRevocationStepDescription={handleUpdateRevocationStepDescription}
            handleResetRevocationSteps={handleResetRevocationSteps}
            readOnly={readOnly}
          />
        </TabsContent>
      </Tabs>
    </form>
  );
} 