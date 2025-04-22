import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, Loader2 } from "lucide-react";
import { User, ApprovalStep } from '../../types/policy.types'; // Assuming ApprovalStep type exists

// Extend ApprovalStep type locally if needed to handle UI state like selected user IDs
interface ApprovalStepUI extends ApprovalStep {
  // Add any UI specific state if needed, e.g. selectedUserIds for multi-select
  selectedUserIds?: string[]; 
}

interface ApprovalStepsSectionProps {
  approvalSteps: ApprovalStepUI[];
  availableReviewers: User[]; // Users who can be selected for steps
  loadingReviewers: boolean;
  handleAddApprovalStep: (type: 'app_owner' | 'specific') => void;
  handleRemoveApprovalStep: (index: number) => void;
  handleUpdateApprovalStepType: (index: number, type: 'app_owner' | 'specific') => void;
  handleUpdateApprovalStepUsers: (index: number, userIds: string[]) => void;
  handleUpdateApprovalStepEscalate: (index: number, escalate: boolean) => void;
  handleResetApprovalSteps: () => void; // Added reset handler prop
  readOnly?: boolean;
}

export default function ApprovalStepsSection({
  approvalSteps,
  availableReviewers,
  loadingReviewers,
  handleAddApprovalStep,
  handleRemoveApprovalStep,
  handleUpdateApprovalStepType,
  handleUpdateApprovalStepUsers,
  handleUpdateApprovalStepEscalate,
  handleResetApprovalSteps,
  readOnly = false,
}: ApprovalStepsSectionProps) {

  // Handler for multi-select user changes (example using simple select for now)
  // In a real multi-select, this would update the selectedUserIds array
  const handleUserSelectionChange = (stepIndex: number, userId: string) => {
    if (readOnly) return;
    // For a single select example:
    handleUpdateApprovalStepUsers(stepIndex, [userId]); 
    // For multi-select: you would toggle the userId in the existing array
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-2xl font-bold">Approval Steps</h2>
          <p className="text-muted-foreground">Set up approval sequence (uses selected Policy Reviewers)</p>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            {approvalSteps.length > 1 && (
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={handleResetApprovalSteps} // Use the reset handler
                className="flex items-center gap-1"
                title="Reset approval steps"
                disabled={readOnly}
              >
                <Trash className="h-4 w-4" /> Reset
              </Button>
            )}
            {/* Simplified Add Button - could use a dropdown like before */}
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => handleAddApprovalStep('specific')} // Default add 'specific'
              className="flex items-center gap-1"
              title="Add new approval step"
              disabled={readOnly}
            >
              <Plus className="h-4 w-4" /> Add Step
            </Button>
          </div>
        )}
      </div>
      
      <Card className="border-secondary/30 shadow-sm">
        <CardContent className="pt-6">
          {approvalSteps.length === 0 && !readOnly && (
             <p className="text-sm text-muted-foreground p-4 text-center">No approval steps defined. Add a step.</p>
          )}
          {approvalSteps.length === 0 && readOnly && (
             <p className="text-sm text-muted-foreground p-4 text-center">No approval steps defined for this policy.</p>
          )}
          {approvalSteps.map((step, index) => (
            <Card key={step.id || index} className="mb-4">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Step {index + 1}</h3>
                  {!readOnly && approvalSteps.length > 0 && (
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveApprovalStep(index)}
                      disabled={readOnly}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Step Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor={`approvalType-${step.id || index}`}>Approval Type</Label>
                  <Select
                    value={step.type}
                    onValueChange={(value) => handleUpdateApprovalStepType(index, value as 'app_owner' | 'specific')}
                    disabled={readOnly}
                  >
                    <SelectTrigger id={`approvalType-${step.id || index}`} className="w-full">
                      <SelectValue placeholder="Select approval type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="app_owner">App Owner</SelectItem>
                      <SelectItem value="specific">Specific Users</SelectItem>
                      {/* Add other types like 'manager' if applicable */}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific User Selection (only if type is 'specific') */}
                {step.type === 'specific' && (
                  <div className="space-y-2">
                    <Label htmlFor={`specificUsers-${step.id || index}`}>Approving User(s)</Label>
                    {loadingReviewers ? (
                       <div className="flex items-center justify-center p-4 border rounded-md">
                         <Loader2 className="h-5 w-5 animate-spin mr-2" />
                         <span className="text-sm text-muted-foreground">Loading reviewers...</span>
                       </div>
                    ) : availableReviewers.length === 0 ? (
                      <div className="text-sm text-muted-foreground p-3 border rounded-md">
                         No reviewers available in the policy reviewer list.
                      </div>
                    ) : (
                      // --- User Selection Dropdown (Example: Single Select) ---
                      // Replace with a proper multi-select component if needed
                      <Select
                        // For multi-select, value would be an array step.selectedUserIds
                        value={step.selectedUserIds?.[0] || ''} // Example for single select
                        onValueChange={(userId) => handleUserSelectionChange(index, userId)}
                        disabled={readOnly}
                      >
                        <SelectTrigger id={`specificUsers-${step.id || index}`} className="w-full">
                          <SelectValue placeholder="Select user(s)..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableReviewers.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center gap-2">
                                {/* Optional: User avatar/initials */}
                                <span>{user.firstName} {user.lastName} ({user.email})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      // --- End User Selection Dropdown --- 
                    )}
                    {/* Display selected users nicely (especially for multi-select) */} 
                    {/* <div className="mt-2 flex flex-wrap gap-1">
                         {step.selectedUserIds?.map(id => <Badge key={id}>{allUsers.find(u=>u.id===id)?.name}</Badge>)}
                       </div> */} 
                  </div>
                )}

                {/* Escalate Checkbox */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id={`escalate-${step.id || index}`}
                    checked={step.escalate}
                    onCheckedChange={(checked) => handleUpdateApprovalStepEscalate(index, checked === true)}
                    disabled={readOnly}
                  />
                  <Label htmlFor={`escalate-${step.id || index}`} className="font-normal text-sm">
                    Escalate
                  </Label>
                </div>

              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 