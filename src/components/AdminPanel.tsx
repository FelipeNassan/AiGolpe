import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Edit2, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { dbService, User } from '../services/database';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  // Carregar usuários
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const allUsers = await dbService.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Iniciar edição
  const startEdit = (user: User) => {
    setEditingId(user.id || null);
    setEditForm({
      name: user.name,
      email: user.email,
      password: user.password,
      score: user.score,
    });
    setError('');
  };

  // Cancelar edição
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError('');
  };

  // Salvar edição
  const saveEdit = async () => {
    if (!editingId) return;

    setError('');
    try {
      // Validação básica
      if (!editForm.name || !editForm.email) {
        setError('Nome e email são obrigatórios');
        return;
      }

      if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
        setError('Email inválido');
        return;
      }

      await dbService.updateUser(editingId, {
        name: editForm.name!,
        email: editForm.email!,
        password: editForm.password || '',
        score: editForm.score || 0,
      });

      await loadUsers();
      cancelEdit();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
    }
  };

  // Remover usuário
  const deleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover o usuário "${userName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setError('');
    try {
      await dbService.deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setError('Erro ao remover usuário');
      console.error(err);
    }
  };

  // Formatar data
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  // Toggle mostrar senha
  const togglePasswordVisibility = (userId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Users className="text-blue-600 w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-800">Gerenciar Usuários</h2>
              <span className="text-sm text-gray-500">({users.length} usuário{users.length !== 1 ? 's' : ''})</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8 text-gray-500">Carregando usuários...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum usuário cadastrado</div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {editingId === user.id ? (
                      // Modo edição
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nome
                            </label>
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Senha
                            </label>
                            <input
                              type="text"
                              value={editForm.password || ''}
                              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Score
                            </label>
                            <input
                              type="number"
                              value={editForm.score || 0}
                              onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) || 0 })}
                              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={saveEdit}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Modo visualização
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                          <div className="font-semibold text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Criado: {formatDate(user.createdAt)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Senha</div>
                          <div className="flex items-center gap-2 justify-center">
                            <span className="font-mono text-sm">
                              {showPasswords[user.id || 0] ? user.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(user.id || 0)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {showPasswords[user.id || 0] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Score</div>
                          <div className="font-bold text-blue-600">{user.score}</div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => startEdit(user)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                            title="Editar usuário"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id!, user.name)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                            title="Remover usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 flex justify-between items-center">
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm"
            >
              Atualizar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminPanel;

