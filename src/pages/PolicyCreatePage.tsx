import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import PolicyForm from '@/components/policy/PolicyForm';
import { Policy, PolicyCreateInput } from '../types/policy.types';
import { fetchApps, type App, createPolicy } from '@/lib/api';

export default function PolicyCreatePage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sample apps for fallback
  const sampleApps = [
    {
      id: "app-1",
      name: "Zoom",
      logo: "https://cdn-icons-png.flaticon.com/512/4401/4401470.png",
    },
    {
      id: "app-2",
      name: "Slack",
      logo: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png",
    },
    {
      id: "app-3",
      name: "Google Workspace",
      logo: "https://cdn-icons-png.flaticon.com/512/2991/2991147.png",
    }
  ];

  // Load apps from backend
  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true);
        const appsData = await fetchApps();
        setApps(appsData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load apps');
        setLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to load apps. Using sample data instead.",
          variant: "destructive"
        });
        
        // Fallback to sample data if API call fails
        setApps(sampleApps);
      }
    };

    loadApps();
  }, []);

  const handleSubmit = async (policyData: Policy) => {
    setSubmitting(true);
    setError(null);

    try {
      // Call the createPolicy function from api.ts
      await createPolicy(policyData as PolicyCreateInput);

      // Success notification
      toast({
        title: "Success",
        description: "Policy created successfully",
      });

      // On success, navigate back to policy list, possibly to the new policy's detail page?
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PolicyForm 
      apps={apps}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      submitting={submitting}
    />
  );
} 