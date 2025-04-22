import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Loader2 } from "lucide-react";
import { User, Group } from "../../types/policy.types";

interface PolicyDetailsSectionProps {
  policyName?: string;
  setPolicyName?: (value: string) => void;
  policyDescription?: string;
  setPolicyDescription?: (value: string) => void;
  policyVisibility: string;
  setPolicyVisibility: (value: string) => void;
  accessLength: string;
  setAccessLength: (value: string) => void;
  accessDurationDays: number;
  setAccessDurationDays: (value: number) => void;
  selectedGroups: Group[];
  selectedUsers: User[];
  allGroups: Group[];
  allUsers: User[];
  loadingResources: boolean;
  handleAddGroup: () => void;
  handleRemoveGroup: (index: number) => void;
  handleUpdateSelectedGroup: (index: number, groupId: string) => void;
  handleAddUser: () => void;
  handleRemoveUser: (index: number) => void;
  handleUpdateSelectedUser: (index: number, userId: string) => void;
  readOnly?: boolean;
}

export default function PolicyDetailsSection({
  policyVisibility,
  setPolicyVisibility,
  accessLength,
  setAccessLength,
  accessDurationDays,
  setAccessDurationDays,
  selectedGroups,
  selectedUsers,
  allGroups,
  allUsers,
  loadingResources,
  handleAddGroup,
  handleRemoveGroup,
  handleUpdateSelectedGroup,
  handleAddUser,
  handleRemoveUser,
  handleUpdateSelectedUser,
  readOnly = false
}: PolicyDetailsSectionProps) {

  const formatUserName = (user: User | undefined) => {
    if (!user) return "Unknown User";
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Policy Visibility <span className="text-red-500">*</span></h2>
        <p className="text-muted-foreground mb-3">Who do you want to see this policy?</p>
        <Select 
          value={policyVisibility}
          onValueChange={(value) => !readOnly && setPolicyVisibility(value)}
          disabled={readOnly}
        >
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="everyone">Everyone</SelectItem>
            <SelectItem value="specific">Specific users or groups</SelectItem>
          </SelectContent>
        </Select>

        {policyVisibility === "specific" && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Groups</h3>
                {!readOnly && (
                  <Button 
                    type="button" variant="outline" size="sm" 
                    onClick={handleAddGroup} disabled={readOnly}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Group
                  </Button>
                )}
              </div>
              
              {loadingResources ? (
                <div className="flex items-center p-2"><Loader2 className="h-4 w-4 mr-2 animate-spin"/> Loading groups...</div>
              ) : selectedGroups.length === 0 && readOnly ? (
                 <p className="text-sm text-muted-foreground">No specific groups assigned.</p>
              ) : selectedGroups.length === 0 && !readOnly ? (
                 <p className="text-sm text-muted-foreground">No groups selected. Click Add Group.</p>
              ) : (
                <div className="space-y-2">
                  {selectedGroups.map((group, index) => (
                    <div key={group.id || index} className="flex items-center gap-2">
                      <Select 
                        value={group.id || ''}
                        onValueChange={(groupId) => handleUpdateSelectedGroup(index, groupId)} 
                        disabled={readOnly || allGroups.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a group">
                            {group.name || "Select a group..."}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {allGroups.length === 0 && <p className="p-2 text-sm text-muted-foreground">No groups found.</p>}
                          {allGroups.map(availableGroup => (
                            <SelectItem key={availableGroup.id} value={availableGroup.id}>
                              {availableGroup.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!readOnly && (
                        <Button 
                          type="button" variant="ghost" size="icon" 
                          onClick={() => handleRemoveGroup(index)} disabled={readOnly}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Users</h3>
                {!readOnly && (
                  <Button 
                    type="button" variant="outline" size="sm" 
                    onClick={handleAddUser} disabled={readOnly}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add User
                  </Button>
                )}
              </div>
              
               {loadingResources ? (
                <div className="flex items-center p-2"><Loader2 className="h-4 w-4 mr-2 animate-spin"/> Loading users...</div>
              ) : selectedUsers.length === 0 && readOnly ? (
                 <p className="text-sm text-muted-foreground">No specific users assigned.</p>
              ) : selectedUsers.length === 0 && !readOnly ? (
                 <p className="text-sm text-muted-foreground">No users selected. Click Add User.</p>
              ) : (
                <div className="space-y-2">
                  {selectedUsers.map((user, index) => (
                    <div key={user.id || index} className="flex items-center gap-2">
                      <Select 
                        value={user.id || ''}
                        onValueChange={(userId) => handleUpdateSelectedUser(index, userId)} 
                        disabled={readOnly || allUsers.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a user">
                             {user.id ? formatUserName(user) : "Select a user..."}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                           {allUsers.length === 0 && <p className="p-2 text-sm text-muted-foreground">No users found.</p>}
                          {allUsers.map(availableUser => (
                            <SelectItem key={availableUser.id} value={availableUser.id}>
                              {formatUserName(availableUser)} ({availableUser.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!readOnly && (
                        <Button 
                          type="button" variant="ghost" size="icon" 
                          onClick={() => handleRemoveUser(index)} disabled={readOnly}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-1">Access length <span className="text-red-500">*</span></h2>
        <p className="text-muted-foreground mb-3">How long should users have access?</p>
        <Select 
          value={accessLength.startsWith('FIXED_') && accessLength !== 'FIXED_CUSTOM' ? 'FIXED_DURATION' : accessLength}
          onValueChange={(value) => {
            if (!readOnly) {
              if (value === 'FIXED_DURATION') {
                setAccessLength('FIXED_WEEK'); // Default to week when selecting fixed duration
              } else {
                setAccessLength(value);
              }
            }
          }}
          disabled={readOnly}
        >
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select access duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INDEFINITE">Indefinite</SelectItem>
            <SelectItem value="FIXED_DURATION">Fixed duration</SelectItem>
            <SelectItem value="FIXED_CUSTOM">Custom duration</SelectItem>
          </SelectContent>
        </Select>

        {accessLength.startsWith('FIXED_') && accessLength !== 'FIXED_CUSTOM' && (
          <div className="mt-4">
            <Label>Duration</Label>
            <Select 
              value={accessLength}
              onValueChange={(value) => !readOnly && setAccessLength(value)}
              disabled={readOnly}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIXED_WEEK">1 Week (7 days)</SelectItem>
                <SelectItem value="FIXED_MONTH">1 Month (30 days)</SelectItem>
                <SelectItem value="FIXED_YEAR">1 Year (365 days)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {accessLength === "FIXED_CUSTOM" && (
          <div className="mt-4 flex items-end gap-2 max-w-md">
            <div className="w-full">
              <Label htmlFor="duration-days">Number of days</Label>
              <Input 
                id="duration-days" 
                type="number" 
                value={accessDurationDays}
                onChange={(e) => !readOnly && setAccessDurationDays(parseInt(e.target.value) || 30)}
                min="1"
                disabled={readOnly}
                readOnly={readOnly}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 