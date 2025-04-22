import { Link } from 'react-router-dom';
import { Policy } from '../../types/policy.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Trash2, Eye } from 'lucide-react';

interface PolicyCardProps {
  policy: Policy;
  onDelete: (id: string) => void;
}

export default function PolicyCard({ policy, onDelete }: PolicyCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          {policy.app.logo && (
            <img src={policy.app.logo} alt={policy.app.name} className="w-6 h-6" />
          )}
          <span className="text-sm text-muted-foreground">{policy.app.name}</span>
        </div>
        <CardTitle>{policy.name}</CardTitle>
        <CardDescription>{policy.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            {policy.accessDurationType === 'FIXED' 
              ? `Access for ${policy.accessDurationDays} days` 
              : 'Indefinite access'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/policies/${policy.id}`}>
            <Eye className="w-4 h-4 mr-1" /> View
          </Link>
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(policy.id)}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
} 