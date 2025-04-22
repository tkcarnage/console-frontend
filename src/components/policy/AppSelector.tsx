import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface App {
  id: string;
  name: string;
  logo?: string;
}

interface AppSelectorProps {
  apps: App[];
  selectedAppId: string;
  setSelectedAppId: (value: string) => void;
  readOnly?: boolean;
}

export default function AppSelector({
  apps,
  selectedAppId,
  setSelectedAppId,
  readOnly = false
}: AppSelectorProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">App <span className="text-red-500">*</span></h2>
      <p className="text-muted-foreground mb-3">Which app is this policy for?</p>
      
      <Select 
        value={selectedAppId} 
        onValueChange={setSelectedAppId}
        disabled={readOnly}
      >
        <SelectTrigger className="w-full max-w-md">
          <SelectValue>
            {apps.find(app => app.id === selectedAppId)?.name || 'Select an app'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {apps.map(app => (
            <SelectItem key={app.id} value={app.id}>
              <div className="flex items-center gap-2">
                {app.logo && (
                  <img src={app.logo} alt={app.name} className="w-5 h-5" />
                )}
                <span>{app.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 