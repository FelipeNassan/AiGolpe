import { motion } from 'framer-motion';
import { StepType } from '../features/SimuladorAntiGolpes';
import { buttonClass } from '../styles/common';
import { useState } from 'react';

interface InterestsProps {
  setStep: (step: StepType) => void;
}

const interestsList = [
  { name: "Tecnologia", description: "Interesse por inovações, dispositivos, aplicativos e tendências tecnológicas." },
  { name: "Fotografia", description: "Paixão por capturar momentos, explorar ângulos e expressar emoções por meio de imagens." },
  { name: "Leitura", description: "Gosto por livros, literatura e o hábito de explorar diferentes gêneros e autores." },
  { name: "Cinema", description: "Apreciação por filmes, diretores, roteiros e experiências cinematográficas." },
  { name: "Música", description: "Interesse em ouvir, criar ou estudar músicas de diversos estilos e épocas." },
  { name: "Viagens", description: "Desejo de conhecer novos lugares, culturas, paisagens e experiências pelo mundo." },
  { name: "Gastronomia", description: "Curiosidade por sabores, pratos típicos, culinária internacional e experiências gastronômicas." },
  { name: "Esportes", description: "Prática ou acompanhamento de esportes, competições e hábitos saudáveis." },
  { name: "Carros", description: "Interesse por automóveis, mecânica, design e novidades do setor automotivo." },
  { name: "Moda", description: "Acompanhamento de tendências, estilos e expressão pessoal por meio da roupa." },
  { name: "Games", description: "Paixão por jogos eletrônicos, consoles, desenvolvimento de jogos e cultura gamer." },
  { name: "Desenvolvimento Pessoal", description: "Busca constante por crescimento, autoconhecimento e habilidades de vida." },
  { name: "Investimentos", description: "Interesse em finanças, mercado de ações, criptomoedas e planejamento financeiro." },
  { name: "Meditação", description: "Prática voltada ao equilíbrio emocional, foco e bem-estar interior." },
  { name: "Empreendedorismo", description: "Vontade de criar negócios, inovar e liderar projetos próprios." },
  { name: "Natureza", description: "Conexão com o meio ambiente, ecologia e atividades ao ar livre." },
  { name: "Animais", description: "Amor e cuidado por pets, vida selvagem e temas relacionados ao bem-estar animal." },
  { name: "Culinária", description: "Interesse em cozinhar, testar receitas e aprimorar técnicas na cozinha." },
  { name: "Artesanato", description: "Gosto por criar objetos manuais como decoração, bijuterias e arte funcional." },
  { name: "Dança", description: "Expressão artística por meio do corpo, ritmo e diversos estilos de dança." },
  { name: "Ciência", description: "Interesse por descobertas, teorias e avanços científicos em várias áreas." },
  { name: "História", description: "Paixão por eventos, civilizações, personagens e lições do passado." },
  { name: "Psicologia", description: "Interesse pelo comportamento humano, emoções e saúde mental." },
  { name: "Moda e Estilo", description: "Exploração de identidade e personalidade através da roupa e aparência." },
  { name: "Humor", description: "Apreciação por comédias, piadas, memes e conteúdos divertidos." },
  { name: "Política", description: "Interesse por debates, ideologias, governo e assuntos sociais." },
  { name: "Religião", description: "Conexão com espiritualidade, crenças, fé e tradições religiosas." },
  { name: "Séries de TV", description: "Gosto por acompanhar narrativas seriadas, personagens e universos diversos." },
  { name: "Podcasts", description: "Consumo de conteúdo em áudio sobre temas variados e aprofundados." },
  { name: "Cultura Pop", description: "Interesse por filmes, música, celebridades, tendências e fenômenos culturais." },
  { name: "Design", description: "Apreciação por estética, funcionalidade e criação visual em diferentes contextos." },
  { name: "Arquitetura", description: "Interesse por construções, urbanismo, design de espaços e estilo arquitetônico." },
  { name: "DIY (Faça Você Mesmo)", description: "Prática de criar, consertar ou personalizar objetos por conta própria." },
  { name: "Jardinagem", description: "Gosto por cuidar de plantas, flores e hortas, promovendo contato com a terra." },
  { name: "Educação", description: "Interesse por ensino, aprendizado e desenvolvimento de conhecimento." },
  { name: "Programação", description: "Criação de softwares, automações e soluções com linguagens de código." },
  { name: "Inteligência Artificial", description: "Exploração de máquinas inteligentes, algoritmos e tecnologias emergentes." },
  { name: "Saúde e Bem-Estar", description: "Cuidado com o corpo e a mente, por meio de hábitos saudáveis e qualidade de vida." },
  { name: "Fotografia com Drone", description: "Paixão por capturar imagens aéreas criativas e explorar novas perspectivas com drones." }
];

const Interests = ({ setStep }: InterestsProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(item => item !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 text-center"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Escolha seus interesses</h2>
      <p className="text-gray-600 mb-4">Selecione os tópicos que mais interessam você</p>
      
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {interestsList.map((item, index) => (
          <motion.button
            key={item.name}
            title={item.description}
            onClick={() => toggleInterest(item.name)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedInterests.includes(item.name) 
                ? 'bg-blue-500 text-white' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {item.name}
          </motion.button>
        ))}

      </div>
      
      <div className="flex gap-3">
        <motion.button 
          className={`${buttonClass} flex-1 bg-gray-400 hover:bg-gray-500`} 
          onClick={() => setStep('register')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Voltar
        </motion.button>
        
        <motion.button 
          className={`${buttonClass} flex-1 bg-blue-600 hover:bg-blue-700 text-white`} 
          onClick={() => setStep('quiz')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuar
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Interests;