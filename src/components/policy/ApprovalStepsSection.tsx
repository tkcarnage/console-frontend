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

  // Handler to toggle user selection for a specific step
  const handleToggleUserForStep = (stepIndex: number, userId: string) => {
    if (readOnly) return;
    const currentStep = approvalSteps[stepIndex];
    const currentSelectedIds = currentStep.selectedUserIds || [];
    const newSelectedIds = currentSelectedIds.includes(userId)
      ? currentSelectedIds.filter(id => id !== userId)
      : [...currentSelectedIds, userId];
    handleUpdateApprovalStepUsers(stepIndex, newSelectedIds);
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
                      // --- Simpler User Selection using Checkboxes --- 
                      <div className="space-y-2 p-3 border rounded-md max-h-48 overflow-y-auto">
                        {availableReviewers.map(reviewer => (
                          <div key={reviewer.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`step-${step.id || index}-user-${reviewer.id}`}
                              checked={step.selectedUserIds?.includes(reviewer.id)}
                              onCheckedChange={() => handleToggleUserForStep(index, reviewer.id)}
                              disabled={readOnly}
                            />
                            <Label 
                              htmlFor={`step-${step.id || index}-user-${reviewer.id}`}
                              className={`flex items-center gap-2 text-sm flex-grow ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                               {/* Optional: Avatar/Initials */}
                               <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                                 {reviewer.firstName?.charAt(0).toUpperCase()}
                                 {reviewer.lastName?.charAt(0).toUpperCase()}
                               </div>
                               <div className="flex flex-col min-w-0">
                                 <span className="font-normal truncate">{reviewer.firstName} {reviewer.lastName}</span>
                                 <span className="text-xs text-muted-foreground truncate">{reviewer.email}</span>
                               </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                      // --- End Simpler User Selection --- 
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