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
        
        setApps([]);
      }
    };

    loadApps();
  }, []);

  const handleSubmit = async (policyData: Policy) => {
    setSubmitting(true);
    setError(null);

    try {
      await createPolicy(policyData as PolicyCreateInput);

      toast({
        title: "Success",
        description: "Policy created successfully",
      });

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