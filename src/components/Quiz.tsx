import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { QuestionType } from '../data/questions';
import { buttonClass } from '../styles/common';
import { useSpeech } from '../hooks/useSpeech';

interface QuizProps {
  currentQuestion: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  setStep: (step: string) => void;
}

const Quiz = ({ currentQuestion, questionNumber, totalQuestions, onAnswer, setStep }: QuizProps) => {
  const { playAudio } = useSpeech();
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const textoParaLer =
    `${currentQuestion.question}. ` +
    currentQuestion.options.map(opt => `${opt.label}: ${opt.text}`).join('. ');

  return (
    <>
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Barra de progresso */}
        <div className="flex justify-between items-center mb-1">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} 
            />
          </div>
          <span className="text-sm font-medium text-gray-600 ml-3 whitespace-nowrap">
            {questionNumber}/{totalQuestions}
          </span>
        </div>

        {/* Pergunta e botão de áudio */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentQuestion.question}
          </h2>
          <motion.button
            className="text-blue-500 p-2 rounded-full hover:bg-blue-100 transition-colors"
            onClick={() => playAudio(textoParaLer)}
            title="Ouvir pergunta e alternativas"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Volume2 size={20} />
          </motion.button>
        </div>

        {/* Alternativas */}
        <div className="flex flex-col gap-3 mt-2">
          {currentQuestion.options.map((opt, index) => (
            <motion.button 
              key={opt.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`${buttonClass} text-left flex items-start hover:bg-blue-600 bg-blue-500 text-white`}
              onClick={() => onAnswer(opt.label)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 mr-3 rounded-full bg-white text-blue-600 font-bold text-sm mt-0.5">
                {opt.label}
              </span>
              <span className="text-left">{opt.text}</span>
            </motion.button>
          ))}
        </div>

        {/* Botão de voltar */}
        <motion.button
          className={`${buttonClass} bg-gray-200 hover:bg-gray-300 text-gray-800 mt-4`}
          onClick={() => setShowConfirmExit(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Voltar à tela inicial
        </motion.button>
      </motion.div>

      {/* Modal de confirmação */}
      {showConfirmExit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 w-80 flex flex-col gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              Deseja voltar à tela inicial?
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Seu progresso será perdido.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className={`${buttonClass} bg-gray-300 hover:bg-gray-400 text-gray-800`}
                onClick={() => setShowConfirmExit(false)}
              >
                Cancelar
              </button>
              <button
                className={`${buttonClass} bg-red-500 hover:bg-red-600 text-white`}
                onClick={() => setStep('welcome')}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Quiz;
