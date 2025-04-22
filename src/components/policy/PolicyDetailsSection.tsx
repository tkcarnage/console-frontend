import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  requireReason: boolean;
  setRequireReason: (value: boolean) => void;
  minDays: number;
  setMinDays: (value: number) => void;
  maxDays: number;
  setMaxDays: (value: number) => void;
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
  requireReason,
  setRequireReason,
  minDays,
  setMinDays,
  maxDays,
  setMaxDays,
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
          value={accessLength}
          onValueChange={(value) => !readOnly && setAccessLength(value)}
          disabled={readOnly}
        >
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select access duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INDEFINITE">Indefinite</SelectItem>
            <SelectItem value="FIXED">Fixed duration</SelectItem>
            <SelectItem value="USER_REQUESTED">User requested</SelectItem>
          </SelectContent>
        </Select>

        {accessLength === "FIXED" && (
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

        {accessLength === "USER_REQUESTED" && (
          <div className="mt-4 space-y-4 max-w-md">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Access Request Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="min-days">Minimum days</Label>
                  <Input 
                    id="min-days" 
                    type="number" 
                    value={minDays}
                    onChange={(e) => !readOnly && setMinDays(parseInt(e.target.value) || 1)}
                    min="1"
                    disabled={readOnly}
                    readOnly={readOnly}
                  />
                </div>
                <div>
                  <Label htmlFor="max-days">Maximum days</Label>
                  <Input 
                    id="max-days" 
                    type="number"
                    value={maxDays}
                    onChange={(e) => !readOnly && setMaxDays(parseInt(e.target.value) || 90)}
                    min="1"
                    disabled={readOnly}
                    readOnly={readOnly}
                  />
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="require-reason" 
                    checked={requireReason}
                    onCheckedChange={(checked) => !readOnly && setRequireReason(checked === true)}
                    disabled={readOnly}
                  />
                  <div>
                    <Label htmlFor="require-reason">Require reason</Label>
                    <p className="text-sm text-muted-foreground">Users must provide a reason for requesting access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 