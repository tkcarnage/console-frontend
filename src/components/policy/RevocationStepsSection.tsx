import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, Trash } from "lucide-react";
import { RevocationStep } from "../../types/policy.types";

// Mock providers for integration options
const INTEGRATION_PROVIDERS = [
  { value: 'okta', label: 'Okta' },
  { value: 'google', label: 'Google Workspace' },
  { value: 'github', label: 'GitHub' },
  { value: 'slack', label: 'Slack' },
  { value: 'azure', label: 'Azure AD' }
];

// Revocation options
const REVOCATION_OPTIONS = {
  'remove_from_group': [
    { value: 'sales', label: 'Sales' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' }
  ],
  'remove_permission': [
    { value: 'read', label: 'Read Access' },
    { value: 'write', label: 'Write Access' },
    { value: 'admin', label: 'Admin Access' },
    { value: 'channel_view', label: 'View Channels' },
    { value: 'channel_post', label: 'Post in Channels' }
  ],
  'disable_account': [
    { value: 'temporary', label: 'Temporary Disable' },
    { value: 'permanent', label: 'Permanent Disable' }
  ]
};

interface RevocationStepsSectionProps {
  revocationSteps: RevocationStep[];
  handleAddRevocationStep: () => void;
  handleRemoveRevocationStep: (index: number) => void;
  handleUpdateRevocationStep: (index: number, field: keyof RevocationStep, value: string) => void;
  handleUpdateRevocationStepProvider: (index: number, provider: string) => void;
  handleUpdateRevocationStepDescription: (index: number, description: string) => void;
  handleResetRevocationSteps: () => void;
  readOnly?: boolean;
}

export default function RevocationStepsSection({
  revocationSteps,
  handleAddRevocationStep,
  handleRemoveRevocationStep,
  handleUpdateRevocationStep,
  handleUpdateRevocationStepProvider,
  handleUpdateRevocationStepDescription,
  handleResetRevocationSteps,
  readOnly = false
}: RevocationStepsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-2xl font-bold">Revoke access</h2>
            <p className="text-muted-foreground">Define how you would like to revoke access from users</p>
          </div>
          {!readOnly && (
            <div className="flex gap-2">
              {revocationSteps.length > 1 && (
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={handleResetRevocationSteps}
                  className="flex items-center gap-1"
                  title="Reset revocation steps"
                  disabled={readOnly}
                >
                  <Trash className="h-4 w-4" /> Reset
                </Button>
              )}
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={handleAddRevocationStep}
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
            {revocationSteps.map((step, index) => {
              const targetOptions = REVOCATION_OPTIONS[step.type as keyof typeof REVOCATION_OPTIONS] || [];
              
              return (
                <Card key={step.id} className="mb-4">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Step {index + 1}</h3>
                      {!readOnly && revocationSteps.length > 1 && (
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveRevocationStep(index)}
                          disabled={readOnly}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Select 
                      value={step.type}
                      onValueChange={(value) => handleUpdateRevocationStep(index, 'type', value)}
                      disabled={readOnly}
                    >
                      <SelectTrigger className="w-full mb-4">
                        <div className="flex items-center gap-2">
                          <Minus className="h-4 w-4" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remove_from_group">Remove from Group</SelectItem>
                        <SelectItem value="remove_permission">Remove Permission</SelectItem>
                        <SelectItem value="disable_account">Disable Account</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={step.target}
                      onValueChange={(value) => handleUpdateRevocationStep(index, 'target', value)}
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
                      <Label htmlFor={`revoke-provider-${step.id}`}>Integration Provider</Label>
                      <Select 
                        value={step.provider}
                        onValueChange={(value) => handleUpdateRevocationStepProvider(index, value)}
                        disabled={readOnly}
                      >
                        <SelectTrigger id={`revoke-provider-${step.id}`} className="w-full">
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
                      <Label htmlFor={`revoke-description-${step.id}`}>Description</Label>
                      <Input
                        id={`revoke-description-${step.id}`}
                        value={step.description || ''}
                        onChange={(e) => handleUpdateRevocationStepDescription(index, e.target.value)}
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