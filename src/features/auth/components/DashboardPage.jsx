import Card from '../../../components/common/Card/Card';
import useAuth from '../hooks/useAuth';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to the Dashboard</h2>
        <p className="text-center text-foreground">
          Hello, {user?.firstName || 'User'}! You have successfully logged in.
        </p>
      </Card>
    </div>
  );
}

export default DashboardPage;
