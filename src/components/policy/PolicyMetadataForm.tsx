import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PolicyMetadataFormProps {
  policyName: string;
  setPolicyName: (value: string) => void;
  policyDescription: string;
  setPolicyDescription: (value: string) => void;
  readOnly?: boolean;
}

export default function PolicyMetadataForm({
  policyName,
  setPolicyName,
  policyDescription,
  setPolicyDescription,
  readOnly = false
}: PolicyMetadataFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="policy-name" className="text-lg font-medium mb-1 block">
          Policy Name <span className="text-red-500">*</span>
        </Label>
        <Input 
          id="policy-name" 
          value={policyName}
          onChange={(e) => setPolicyName(e.target.value)}
          className="text-2xl font-bold py-2"
          placeholder="Enter policy name"
          disabled={readOnly}
          readOnly={readOnly}
        />
      </div>
      <div>
        <Label htmlFor="policy-description" className="text-lg font-medium mb-1 block">
          Description
        </Label>
        <Textarea 
          id="policy-description" 
          value={policyDescription}
          onChange={(e) => setPolicyDescription(e.target.value)}
          className="text-lg"
          placeholder="Enter policy description"
          rows={3}
          disabled={readOnly}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
} 