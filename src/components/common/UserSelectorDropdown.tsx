import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserContext } from '@/context/UserContext';
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const UserSelectorDropdown: React.FC = () => {
  const { users, selectedUserId, setSelectedUserId, loadingUsers, userError } = useUserContext();

  const handleValueChange = (value: string) => {
    // If the "None" option is selected, set ID to null
    setSelectedUserId(value === 'none' ? null : value);
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="user-selector" className="text-sm font-medium whitespace-nowrap">
        Act as:
      </Label>
      {loadingUsers ? (
        <div className="h-9 w-[180px] flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : userError ? (
        <span className="text-xs text-destructive">Error loading users</span>
      ) : (
        <Select 
          value={selectedUserId ?? 'none'} // Use 'none' for null/undefined
          onValueChange={handleValueChange}
          disabled={users.length === 0} // Disable if no users loaded
        >
          <SelectTrigger id="user-selector" className="w-[180px]">
            <SelectValue placeholder="Select User..." />
          </SelectTrigger>
          <SelectContent>
            {/* Option for selecting no specific user */}
            <SelectItem value="none">Select User...</SelectItem> 
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default UserSelectorDropdown; 