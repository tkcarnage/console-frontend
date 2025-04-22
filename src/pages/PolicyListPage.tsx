import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Policy } from '../types/policy.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PolicyCard from '@/components/policy/PolicyCard';
import { deletePolicy, fetchPolicies } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useUserContext } from '@/context/UserContext';

export default function PolicyListPage() {
  const { selectedUserId } = useUserContext();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPolicies(selectedUserId);
      setPolicies(data);
    } catch (err) {
      console.error("Failed to fetch policies:", err);
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred while fetching policies';
      setError(errorMsg);
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) {
      return;
    }

    try {
      setError(null);
      await deletePolicy(id);
      
      setPolicies(prevPolicies => prevPolicies.filter(policy => policy.id !== id));
      
      toast({ title: "Success", description: "Policy deleted successfully." });
      
    } catch (err) {
      console.error("Failed to delete policy:", err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete policy';
      setError(errorMsg);
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
      <p className="text-lg">Loading policies...</p>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
      <p className="text-lg text-destructive mb-4">Error loading policies</p>
      <p className="text-sm text-muted-foreground mb-4">{error}</p>
      <Button onClick={loadPolicies} variant="outline">Try Again</Button>
    </div>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Policies</h1>
        <Button asChild>
          <Link to="/policies/new">Create Policy</Link>
        </Button>
      </div>

      {policies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground mb-4">No policies found.</p>
            <Button asChild variant="secondary">
               <Link to="/policies/new">Create your first policy</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <PolicyCard 
              key={policy.id} 
              policy={policy} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
} 