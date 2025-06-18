import { motion } from 'framer-motion';
import { StepType } from '../features/SimuladorAntiGolpes';
import { buttonClass } from '../styles/common';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  setStep: (step: StepType) => void;
}

interface User {
  email: string;
  password: string;
  name: string;
  score: number;
}

const Login = ({ setStep }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLoginError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const { email, password } = formData;

    if (!email) {
      newErrors.email = 'Email é obrigatório.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Digite um e-mail válido.';
      }
    }

    if (!password) newErrors.password = 'Senha é obrigatória.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkCredentials = (): User | null => {
    const usersJSON = localStorage.getItem('users');
    if (!usersJSON) return null;

    const users: User[] = JSON.parse(usersJSON);
    return users.find(user => user.email === formData.email && user.password === formData.password) || null;
  };

  const handleSubmit = () => {
    setLoginError('');
    if (validateForm()) {
      const validUser = checkCredentials();
      if (validUser) {
        // Salva o usuário logado no localStorage para manter o estado de login
        localStorage.setItem('currentUser', JSON.stringify(validUser));
        // Vai para a tela dashboard, onde mostra o score e opções
        setStep('dashboard');
      } else {
        setLoginError('Email ou senha incorretos.');
      }
    }
  };

  const inputClass = (field: string) =>
    `w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  const labelClass = (field: string) =>
    `block text-sm font-medium mb-1 ${
      errors[field] ? 'text-red-600' : 'text-gray-700'
    }`;

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-blue-700 text-center mb-2">ENTRAR</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass('email')}>Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com" 
            className={inputClass('email')} 
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className={labelClass('password')}>Senha</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Senha" 
              className={`${inputClass('password')} pr-10`} 
            />
            <button 
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>
      </div>

      {Object.values(errors).length > 0 && (
        <div className="text-red-600 text-sm mt-2 text-center">
          Corrija os campos destacados acima.
        </div>
      )}

      {loginError && (
        <div className="text-red-600 text-sm mt-2 text-center">
          {loginError}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <motion.button 
          className={`${buttonClass} flex-1 bg-gray-400 hover:bg-gray-500`} 
          onClick={() => setStep('welcome')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Voltar
        </motion.button>
        
        <motion.button 
          className={`${buttonClass} flex-1 bg-blue-700 hover:bg-blue-800 text-white`}
          onClick={handleSubmit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuar
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Login;
