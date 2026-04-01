import { Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  // Redirect to home since we now use App-level routing
  if (typeof window !== 'undefined') {
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Swords className="w-8 h-8 text-primary animate-pulse" />
    </div>
  );
};

export default Index;
