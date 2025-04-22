import { Link } from 'react-router-dom';
import { Policy } from '../../types/policy.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Trash2, Eye } from 'lucide-react';

interface PolicyCardProps {
  policy: Policy;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export function PolicyCard({ policy, onClick, onDelete }: PolicyCardProps) {
  const isFixedDuration = policy.accessDurationType.startsWith('FIXED_');
  
  let durationText = 'Indefinite access';
  if (isFixedDuration) {
    switch (policy.accessDurationType) {
      case 'FIXED_WEEK':
        durationText = '1 week access';
        break;
      case 'FIXED_MONTH':
        durationText = '1 month access';
        break;
      case 'FIXED_YEAR':
        durationText = '1 year access';
        break;
      default:
        durationText = `${policy.accessDurationDays} days access`;
    }
  }

  return (
    <Card
      className="hover:bg-accent hover:cursor-pointer transition-colors"
      onClick={onClick}
    >
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
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{durationText}</span>
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
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete(policy.id);
          }}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
} 