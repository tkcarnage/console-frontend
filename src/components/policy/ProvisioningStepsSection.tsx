import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { ProvisioningStep } from "../../types/policy.types";

// Mock providers for integration options
const INTEGRATION_PROVIDERS = [
  { value: 'okta', label: 'Okta' },
  { value: 'google', label: 'Google Workspace' },
  { value: 'github', label: 'GitHub' },
  { value: 'slack', label: 'Slack' },
  { value: 'azure', label: 'Azure AD' }
];

// Mock data for different dropdown options based on step type
const PROVISIONING_OPTIONS = {
  'add_to_group': [
    { value: 'sales', label: 'Sales' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' }
  ],
  'add_permission': [
    { value: 'read', label: 'Read Access' },
    { value: 'write', label: 'Write Access' },
    { value: 'admin', label: 'Admin Access' },
    { value: 'channel_view', label: 'View Channels' },
    { value: 'channel_post', label: 'Post in Channels' }
  ],
  'create_account': [
    { value: 'regular', label: 'Regular Account' },
    { value: 'restricted', label: 'Restricted Account' },
    { value: 'temporary', label: 'Temporary Account (30 days)' },
    { value: 'guest', label: 'Guest Account' }
  ]
};

interface ProvisioningStepsSectionProps {
  provisioningSteps: ProvisioningStep[];
  handleAddProvisioningStep: () => void;
  handleRemoveProvisioningStep: (index: number) => void;
  handleUpdateProvisioningStep: (index: number, field: keyof ProvisioningStep, value: string) => void;
  handleUpdateProvisioningStepProvider: (index: number, provider: string) => void;
  handleUpdateProvisioningStepDescription: (index: number, description: string) => void;
  handleResetProvisioningSteps: () => void;
  readOnly?: boolean;
}

export default function ProvisioningStepsSection({
  provisioningSteps,
  handleAddProvisioningStep,
  handleRemoveProvisioningStep,
  handleUpdateProvisioningStep,
  handleUpdateProvisioningStepProvider,
  handleUpdateProvisioningStepDescription,
  handleResetProvisioningSteps,
  readOnly = false
}: ProvisioningStepsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-2xl font-bold">Grant access</h2>
            <p className="text-muted-foreground">Define how you would like to grant access to users</p>
          </div>
          {!readOnly && (
            <div className="flex gap-2">
              {provisioningSteps.length > 1 && (
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={handleResetProvisioningSteps}
                  className="flex items-center gap-1"
                  title="Reset provisioning steps"
                  disabled={readOnly}
                >
                  <Trash className="h-4 w-4" /> Reset
                </Button>
              )}
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={handleAddProvisioningStep}
                className="flex items-center gap-1"
                title="Add new step"
                disabled={readOnly}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <Card className="border-secondary/30 shadow-sm">
          <CardContent className="pt-6">
            {provisioningSteps.map((step, index) => {
              const targetOptions = PROVISIONING_OPTIONS[step.type as keyof typeof PROVISIONING_OPTIONS] || [];
              
              return (
                <Card key={step.id} className="mb-4">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Step {index + 1}</h3>
                      {!readOnly && provisioningSteps.length > 1 && (
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveProvisioningStep(index)}
                          disabled={readOnly}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Select 
                      value={step.type}
                      onValueChange={(value) => handleUpdateProvisioningStep(index, 'type', value)}
                      disabled={readOnly}
                    >
                      <SelectTrigger className="w-full mb-4">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add_to_group">Add to Group</SelectItem>
                        <SelectItem value="add_permission">Add Permission</SelectItem>
                        <SelectItem value="create_account">Create Account</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={step.target}
                      onValueChange={(value) => handleUpdateProvisioningStep(index, 'target', value)}
                      disabled={readOnly}
                    >
                      <SelectTrigger className="w-full mb-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {targetOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="space-y-2">
                      <Label htmlFor={`provider-${step.id}`}>Integration Provider</Label>
                      <Select 
                        value={step.provider}
                        onValueChange={(value) => handleUpdateProvisioningStepProvider(index, value)}
                        disabled={readOnly}
                      >
                        <SelectTrigger id={`provider-${step.id}`} className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INTEGRATION_PROVIDERS.map(provider => (
                            <SelectItem key={provider.value} value={provider.value}>
                              {provider.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`description-${step.id}`}>Description</Label>
                      <Input
                        id={`description-${step.id}`}
                        value={step.description || ''}
                        onChange={(e) => handleUpdateProvisioningStepDescription(index, e.target.value)}
                        placeholder="Explain what this step does"
                        disabled={readOnly}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 