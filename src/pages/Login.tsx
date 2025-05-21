import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Effect to redirect user if already logged in
  useEffect(() => {
    if (user) {
      redirectToDashboard();
    }
  }, [user]);
  
  // Function to redirect based on user role
  const redirectToDashboard = () => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'doctor':
          navigate('/doctor-dashboard');
          break;
        case 'patient':
          navigate('/patient-dashboard');
          break;
        default:
          navigate('/login');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      // The redirect will happen in the useEffect when user state changes
    } catch (error) {
      console.error('Login error:', error);
      // Toast notification is handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo account quick login
  const loginAsDemoAccount = (role: string) => {
    let demoEmail = '';
    let demoPassword = '';
    
    switch (role) {
      case 'admin':
        demoEmail = 'admin@hospital.com';
        demoPassword = 'admin123';
        break;
      case 'doctor':
        demoEmail = 'doctor@hospital.com';
        demoPassword = 'doctor123';
        break;
      case 'patient':
        demoEmail = 'patient@hospital.com';
        demoPassword = 'patient123';
        break;
      default:
        return;
    }
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    // Submit the form with credentials
    login(demoEmail, demoPassword)
      .catch((error) => console.error('Demo login error:', error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hospital-50">
      <div className="w-full max-w-md px-4">
        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Hospital className="h-12 w-12 text-hospital-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-hospital-600">
              MediCare Hospital
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-hospital-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-hospital-600 hover:bg-hospital-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Demo accounts for testing
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loginAsDemoAccount('admin')}
                  className="text-xs"
                >
                  Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loginAsDemoAccount('doctor')}
                  className="text-xs"
                >
                  Doctor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loginAsDemoAccount('patient')}
                  className="text-xs"
                >
                  Patient
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Don't have an account?{' '}
              <Link to="/register" className="text-hospital-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
