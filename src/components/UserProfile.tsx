import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Play, Trophy, TrendingUp, BarChart3 } from 'lucide-react';
import { dbService, QuizAttempt } from '../services/database';
import { buttonClass } from '../styles/common';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface UserProfileProps {
  userId: number;
  userName: string;
  onPlay: () => void;
  onLogout: () => void;
}

const UserProfile = ({ userId, userName, onPlay, onLogout }: UserProfileProps) => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    lastAttempt: null as QuizAttempt | null | undefined,
  });

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userAttempts = await dbService.getUserQuizAttempts(userId);
      const userStats = await dbService.getUserStats(userId);
      setAttempts(userAttempts);
      setStats(userStats);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepara dados para o gráfico
  const chartData = attempts
    .slice()
    .reverse()
    .map((attempt, index) => ({
      name: `Jogada ${index + 1}`,
      score: attempt.score,
      percentage: attempt.percentage,
      date: new Date(attempt.completedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
    }));

  // Formata data
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-gray-500">Carregando seus dados...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Olá, {userName}!</h1>
          <p className="text-gray-600 text-sm mt-1">Acompanhe sua evolução</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total de Jogadas</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.totalAttempts}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Média de Acertos</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {stats.averageScore.toFixed(1)}
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Melhor Pontuação</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700">{stats.bestScore}</div>
        </div>
      </div>

      {/* Gráfico de Evolução */}
      {attempts.length > 0 ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Evolução das Pontuações</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Pontos', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'score') return [`${value} pontos`, 'Acertos'];
                    if (name === 'percentage')
                      return [`${value}%`, 'Percentual'];
                    return value;
                  }}
                  labelFormatter={(label) => `Jogada: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center py-8 bg-gray-50 rounded-lg">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Você ainda não tem jogadas registradas</p>
          <p className="text-gray-500 text-sm mt-1">
            Comece a jogar para ver sua evolução aqui!
          </p>
        </div>
      )}

      {/* Histórico de Jogadas */}
      {attempts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Jogadas</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {attempts.slice(0, 5).map((attempt, index) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {attempt.score} de {attempt.totalQuestions} acertos
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(attempt.completedAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      attempt.percentage >= 70
                        ? 'text-green-600'
                        : attempt.percentage >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {attempt.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão Jogar */}
      <div className="flex justify-center">
        <motion.button
          onClick={onPlay}
          className={`${buttonClass} bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 max-w-xs`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-5 h-5" />
          Começar Quiz
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UserProfile;

