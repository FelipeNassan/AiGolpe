import { useState, useEffect } from 'react';
import Welcome from '../components/Welcome';
import Registration from '../components/Registration';
import Login from '../components/Login';
import Interests from '../components/Interests';
import Quiz from '../components/Quiz';
import Result from '../components/Result';
import Completion from '../components/Completion';
import {
  questions as allOriginalQuestions,
  getRandomQuestions,
  QuestionType,
} from '../data/questions';

export type StepType =
  | 'welcome'
  | 'register'
  | 'login'
  | 'interests'
  | 'quiz'
  | 'result'
  | 'end';

const SimuladorAntiGolpes = () => {
  // Controle de tela
  const [step, setStep] = useState<StepType>('welcome');
  
  // Usuário logado
  const [username, setUsername] = useState<string | null>(null);

  // Quiz state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [shuffledQuizQuestions, setShuffledQuizQuestions] = useState<QuestionType[]>([]);

  // Carregar perguntas randomizadas ao iniciar ou resetar quiz
  useEffect(() => {
    setShuffledQuizQuestions(getRandomQuestions(10));
  }, []);

  // Ao logar, carregar score salvo do localStorage
  useEffect(() => {
    if (username) {
      const savedScore = localStorage.getItem(`score_${username}`);
      if (savedScore) {
        setScore(Number(savedScore));
      } else {
        setScore(0);
      }
    } else {
      setScore(0);
    }
  }, [username]);

  const currentQuizQuestion = shuffledQuizQuestions[questionIndex];

  // Quando usuário responde
  const handleAnswer = (answer: string) => {
    if (!currentQuizQuestion) return;
    const correct = answer === currentQuizQuestion.correct;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
    setStep('result');
  };

  // Próxima pergunta
  const nextQuestion = () => {
    if (questionIndex + 1 < shuffledQuizQuestions.length) {
      setQuestionIndex(prev => prev + 1);
      setIsCorrect(null);
      setStep('quiz');
    } else {
      // Salva score ao final do quiz, se logado
      if (username) {
        localStorage.setItem(`score_${username}`, score.toString());
      }
      setStep('end');
    }
  };

  // Reinicia quiz (para jogar de novo)
  const resetQuiz = () => {
    setShuffledQuizQuestions(getRandomQuestions(10));
    setQuestionIndex(0);
    setScore(0);
    setIsCorrect(null);
    setStep('quiz');
  };

  // Logout e reset geral
  const resetAll = () => {
    setUsername(null);
    setShuffledQuizQuestions(getRandomQuestions(10));
    setQuestionIndex(0);
    setScore(0);
    setIsCorrect(null);
    setStep('welcome');
  };

  // Login bem-sucedido
  const onLoginSuccess = (user: string) => {
    setUsername(user);
  };


  const canRenderQuiz = step === 'quiz' && currentQuizQuestion;
  const canRenderResult = step === 'result' && currentQuizQuestion;

  return (
    <div className="max-w-md w-full mx-auto">
      {step === 'welcome' && <Welcome setStep={setStep} />}
      {step === 'register' && <Registration setStep={setStep} />}
      {step === 'login' && <Login setStep={setStep} onLoginSuccess={onLoginSuccess} />}
      {step === 'interests' && <Interests setStep={setStep} />}
      {canRenderQuiz && (
        <Quiz
          currentQuestion={currentQuizQuestion}
          questionNumber={questionIndex + 1}
          totalQuestions={shuffledQuizQuestions.length}
          onAnswer={handleAnswer}
          setStep={setStep}
        />
      )}
      {canRenderResult && (
        <Result
          isCorrect={isCorrect}
          tip={currentQuizQuestion.tip}
          nextQuestion={nextQuestion}
        />
      )}
      {step === 'end' && (
        <Completion
          score={score}
          total={shuffledQuizQuestions.length}
          setStep={setStep}
          resetQuiz={resetQuiz}
          resetAll={resetAll}
        />
      )}
    </div>
  );
};

export default SimuladorAntiGolpes;
