import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../../lib/axios';
import { ROUTES } from '../../constants/routes';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be under 50 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/register', {
        username: values.username,
        password: values.password
      });
      if (res.data) {
        toast.success('Registration successful! Please login.');
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMsg = (err as any).response?.data?.detail || 'Registration failed. Try a different username.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="text-3xl">🏠</div>
          <h2 className="text-2xl font-extrabold text-secondary tracking-tight">Create Account</h2>
          <p className="text-slate-500 text-xs">Set up your profile to organize groceries, bills, and family tasks.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-xs font-semibold text-slate-500 mb-1">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Pick a unique username"
              {...register('username')}
              className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
                errors.username ? 'border-error/50 focus:border-error' : 'border-slate-200'
              }`}
            />
            {errors.username && <span className="text-[10px] font-bold text-error mt-1">{errors.username.message}</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-xs font-semibold text-slate-500 mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
                errors.password ? 'border-error/50 focus:border-error' : 'border-slate-200'
              }`}
            />
            {errors.password && <span className="text-[10px] font-bold text-error mt-1">{errors.password.message}</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-500 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
                errors.confirmPassword ? 'border-error/50 focus:border-error' : 'border-slate-200'
              }`}
            />
            {errors.confirmPassword && <span className="text-[10px] font-bold text-error mt-1">{errors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm text-sm disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
