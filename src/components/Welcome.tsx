import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { StepType } from '../features/SimuladorAntiGolpes';
import { buttonClass } from '../styles/common';

interface WelcomeProps {
  setStep: (step: StepType) => void;
}

const Welcome = ({ setStep }: WelcomeProps) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-2">
        <Shield className="text-blue-600 w-16 h-16" />
      </div>
      
      <h1 className="text-2xl font-bold text-center text-blue-700">
        AiGolpe<br />Simulador educativo anti-golpes
      </h1>

      <p className="text-gray-600 text-center">
        Aprenda a identificar e evitar golpes online com este simulador interativo.
      </p>

      <motion.button 
        className={`${buttonClass} bg-white border border-blue-700 text-blue-700 hover:bg-blue-50`} 
        onClick={() => setStep('login')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Entrar
      </motion.button>

      <motion.button 
        className={`${buttonClass} bg-blue-700 hover:bg-blue-800 text-white`} 
        onClick={() => setStep('register')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Registrar
      </motion.button>
      
      <motion.button 
        className={`${buttonClass} bg-blue-400 hover:bg-blue-500 text-white`} 
        onClick={() => setStep('quiz')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Continuar sem registrar
      </motion.button>
    </motion.div>
  );
};

export default Welcome;
