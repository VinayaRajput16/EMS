import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');  // ✅ SEPARATE ERROR STATE
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Clear previous submit error only
    setSubmitError('');
    
    console.log('Login attempt:', formData);
    
    try {
      await login(formData);
      
      // Success redirect
      const role = localStorage.getItem('role');
      console.log('Stored role:', role);
      
      if (role === 'ORGANIZER') {
        navigate('/organizer/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      // ✅ ERROR STAYS FOREVER - SEPARATE STATE
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Login failed. Please try again.';
      setSubmitError(errorMsg);
      console.error('Login ERROR:', error.response?.data || error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Sign in to your EMS account</p>
        </div>
        
        <Card className="p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ✅ FIXED: SEPARATE ERROR - NEVER DISAPPEARS */}
            {submitError && (
              <div className="bg-red-50 border-l-6 border-red-500 text-red-900 p-5 rounded-xl shadow-lg mb-6">
                <div className="font-bold text-lg mb-2 flex items-center">
                  ❌ {submitError.includes('token') ? 'Authentication Error' : 'Login Failed'}
                </div>
                <div className="text-sm leading-relaxed">{submitError}</div>
                <button
                  type="button"
                  onClick={() => setSubmitError('')}
                  className="mt-3 text-xs text-red-700 hover:text-red-900 font-semibold underline"
                >
                  ✕ Dismiss
                </button>
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            
            <Button type="submit" size="lg" className="w-full shadow-xl">
              Sign In
            </Button>
            
            <div className="text-center">
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
