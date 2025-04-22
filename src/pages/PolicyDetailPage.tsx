import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { Loader2, Edit, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PolicyForm from '@/components/policy/PolicyForm';
import { Policy } from '../types/policy.types';
import { fetchApps, fetchPolicy, type App, updatePolicy } from '@/lib/api';

export default function PolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingResources(true);
        
        let policyData: Policy;
        if (!id) {
          throw new Error("Policy ID is missing");
        }
        
        try {
          policyData = await fetchPolicy(id);
        } catch (policyError) {
          console.error("Error loading policy:", policyError);
          toast({
            title: "Error",
            description: "Failed to load policy. Using sample data instead.",
            variant: "destructive"
          });
          setPolicy(null);
          throw policyError;
        }
        
        let appsData: App[];
        try {
          appsData = await fetchApps();
        } catch (appsError) {
          console.error("Error loading apps:", appsError);
          toast({
            title: "Error",
            description: "Failed to load apps. Using sample data instead.",
            variant: "destructive"
          });
          appsData = [];
        }
        
        setPolicy(policyData);
        setApps(appsData);
      } finally {
        setLoading(false);
        setLoadingResources(false);
      }
    };
  
    loadData();
  }, [id]);

  const handleFormSubmit = async (policyData: Policy) => {
    if (!id) return;
    setSubmitting(true);
    setError(null);

    try {
      const updatedPolicyData = await updatePolicy(id, policyData);

      toast({
        title: "Success",
        description: "Policy updated successfully",
      });

      setPolicy(updatedPolicyData);
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during update';
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

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-lg">Loading Policy...</p>
    </div>
  );

  if (!policy) return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <p className="text-lg mb-4">Policy not found</p>
      <Button onClick={() => navigate('/')}>Back to Policies</Button>
    </div>
  );

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-6 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          size="sm"
          className="flex items-center gap-1"
          disabled={isEditing}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Policies
        </Button>
        
        <div>
          {isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              disabled={submitting}
              className="flex items-center gap-1 mr-2"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" /> Edit Policy
            </Button>
          )}
        </div>
      </div>

      <PolicyForm 
        apps={apps}
        loading={loadingResources}
        error={error}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        initialData={policy}
        readOnly={!isEditing}
      />
    </div>
  );
} 