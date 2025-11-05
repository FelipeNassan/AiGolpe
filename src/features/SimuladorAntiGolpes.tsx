import { useState, useEffect } from 'react';
import Welcome from '../components/Welcome';
import Registration from '../components/Registration';
import Login from '../components/Login';
import Interests from '../components/Interests';
import Quiz from '../components/Quiz';
import Result from '../components/Result';
import Completion from '../components/Completion';
import UserProfile from '../components/UserProfile';
import {
  questions as allOriginalQuestions,
  getRandomQuestions,
  QuestionType,
} from '../data/questions';
import { dbService } from '../services/database';

export type StepType =
  | 'welcome'
  | 'register'
  | 'login'
  | 'profile'
  | 'interests'
  | 'quiz'
  | 'result'
  | 'end';

const SimuladorAntiGolpes = () => {
  // Controle de tela
  const [step, setStep] = useState<StepType>('welcome');
  
  // Usuário logado
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Quiz state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [shuffledQuizQuestions, setShuffledQuizQuestions] = useState<QuestionType[]>([]);

  // Carregar perguntas randomizadas ao iniciar ou resetar quiz
  useEffect(() => {
    setShuffledQuizQuestions(getRandomQuestions(10));
  }, []);

  // Ao logar, carregar score salvo do banco de dados
  useEffect(() => {
    const loadUserScore = async () => {
      if (userId) {
        try {
          const user = await dbService.getUserById(userId);
          if (user) {
            setScore(user.score);
          } else {
            setScore(0);
          }
        } catch (error) {
          console.error('Erro ao carregar score:', error);
          setScore(0);
        }
      } else {
        setScore(0);
      }
    };

    loadUserScore();
  }, [userId]);

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
  const nextQuestion = async () => {
    if (questionIndex + 1 < shuffledQuizQuestions.length) {
      setQuestionIndex(prev => prev + 1);
      setIsCorrect(null);
      setStep('quiz');
    } else {
      // Salva histórico da partida e score ao final do quiz, se logado
      if (userId) {
        try {
          const totalQuestions = shuffledQuizQuestions.length;
          const percentage = Math.round((score / totalQuestions) * 100);
          
          // Salva histórico da partida
          await dbService.saveQuizAttempt({
            userId,
            score,
            totalQuestions,
            percentage,
          });
          
          // Atualiza score máximo do usuário
          await dbService.updateUserScore(userId, score);
          
          // Atualiza também no localStorage para manter sincronizado
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            const user = JSON.parse(currentUser);
            user.score = score;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        } catch (error) {
          console.error('Erro ao salvar histórico:', error);
        }
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
    setUserId(null);
    localStorage.removeItem('currentUser');
    setShuffledQuizQuestions(getRandomQuestions(10));
    setQuestionIndex(0);
    setScore(0);
    setIsCorrect(null);
    setStep('welcome');
  };

  // Login bem-sucedido
  const onLoginSuccess = (user: string, id: number) => {
    setUsername(user);
    setUserId(id);
  };
  
  // Voltar para o perfil após jogar
  const goToProfile = () => {
    setShuffledQuizQuestions(getRandomQuestions(10));
    setQuestionIndex(0);
    setScore(0);
    setIsCorrect(null);
    setStep('profile');
  };

  // Verifica se há usuário logado ao montar o componente
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        if (userData.name && userData.id) {
          setUsername(userData.name);
          setUserId(userData.id);
        }
      } catch (error) {
        console.error('Erro ao recuperar usuário logado:', error);
      }
    }
  }, []);


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
      {step === 'profile' && userId && username && (
        <UserProfile
          userId={userId}
          userName={username}
          onPlay={() => {
            setShuffledQuizQuestions(getRandomQuestions(10));
            setQuestionIndex(0);
            setScore(0);
            setIsCorrect(null);
            setStep('quiz');
          }}
          onLogout={resetAll}
        />
      )}
      {step === 'end' && (
        <Completion
          score={score}
          total={shuffledQuizQuestions.length}
          setStep={setStep}
          resetQuiz={resetQuiz}
          resetAll={resetAll}
          goToProfile={userId ? goToProfile : undefined}
        />
      )}
    </div>
  );
};

export default SimuladorAntiGolpes;
