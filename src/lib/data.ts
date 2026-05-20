import type { School, Review, Professional } from './types';

export const SCHOOLS: School[] = [
  {
    id: '1', name: 'Colégio Santos Dumont', slug: 'colegio-santos-dumont',
    type: 'particular', stages: ['fundamental', 'medio'],
    address: 'Rua dos Pinheiros, 420', city: 'São Paulo', state: 'SP', neighborhood: 'Pinheiros',
    lat: -23.564, lng: -46.683, rating: 4.7, reviewCount: 128,
    avgPrice: 2800, priceMin: 2400, priceMax: 3200,
    isVerified: true, isAutismFriendly: true, isClaimed: true,
    categories: [
      { label: 'Atendimento', value: 4.8 }, { label: 'Pedagogia', value: 4.9 },
      { label: 'Estrutura', value: 4.6 }, { label: 'Segurança', value: 4.7 },
      { label: 'Comunicação', value: 4.5 }, { label: 'Inclusão', value: 3.8 },
      { label: 'Custo-benefício', value: 4.2 }, { label: 'Alimentação', value: 4.4 },
      { label: 'Extracurricular', value: 4.3 },
    ],
    description: 'Escola tradicional com foco em excelência acadêmica e formação integral do aluno.',
    phone: '(11) 3456-7890', website: 'https://colegiosantosdumont.com.br',
    photos: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'],
    highlights: ['Nota 9.2 no ENEM', 'Laboratório de robótica', 'Período integral disponível'],
  },
  {
    id: '2', name: 'Escola Estadual Prof.ª Maria da Silva', slug: 'ee-maria-da-silva',
    type: 'estadual', stages: ['fundamental', 'medio'],
    address: 'Av. das Nações, 1200', city: 'Santo André', state: 'SP', neighborhood: 'Centro',
    lat: -23.663, lng: -46.531, rating: 3.9, reviewCount: 74,
    avgPrice: 0, priceMin: 0, priceMax: 0,
    isVerified: false, isAutismFriendly: false, isClaimed: false,
    categories: [
      { label: 'Atendimento', value: 3.7 }, { label: 'Pedagogia', value: 4.1 },
      { label: 'Estrutura', value: 3.2 }, { label: 'Segurança', value: 4.0 },
      { label: 'Comunicação', value: 3.5 }, { label: 'Inclusão', value: 4.2 },
      { label: 'Custo-benefício', value: 4.8 }, { label: 'Alimentação', value: 3.6 },
      { label: 'Extracurricular', value: 3.0 },
    ],
    description: 'Escola pública estadual com boa reputação pedagógica e professores dedicados.',
    phone: '(11) 4567-8901', website: '',
    photos: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'],
    highlights: ['Gratuita', 'Professores concursados', 'Merenda escolar'],
  },
  {
    id: '3', name: 'Colégio Internacional Bilíngue', slug: 'colegio-internacional-bilingue',
    type: 'bilingue', stages: ['infantil', 'fundamental'],
    address: 'Rua Europa, 680', city: 'São Paulo', state: 'SP', neighborhood: 'Moema',
    lat: -23.606, lng: -46.665, rating: 4.9, reviewCount: 203,
    avgPrice: 5200, priceMin: 4800, priceMax: 6000,
    isVerified: true, isAutismFriendly: true, isClaimed: true,
    categories: [
      { label: 'Atendimento', value: 5.0 }, { label: 'Pedagogia', value: 4.9 },
      { label: 'Estrutura', value: 5.0 }, { label: 'Segurança', value: 4.9 },
      { label: 'Comunicação', value: 4.8 }, { label: 'Inclusão', value: 4.7 },
      { label: 'Custo-benefício', value: 3.9 }, { label: 'Alimentação', value: 4.8 },
      { label: 'Extracurricular', value: 5.0 },
    ],
    description: 'Educação bilíngue português-inglês com metodologia internacional e infraestrutura de excelência.',
    phone: '(11) 3678-9012', website: 'https://cibiingue.com.br',
    photos: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'],
    highlights: ['100% bilíngue', 'Certificação Cambridge', 'Piscina aquecida'],
  },
  {
    id: '4', name: 'Colégio Objetivo Campinas', slug: 'colegio-objetivo-campinas',
    type: 'particular', stages: ['fundamental', 'medio'],
    address: 'Av. Brasil, 2340', city: 'Campinas', state: 'SP', neighborhood: 'Cambuí',
    lat: -22.905, lng: -47.060, rating: 4.5, reviewCount: 91,
    avgPrice: 1900, priceMin: 1600, priceMax: 2200,
    isVerified: true, isAutismFriendly: false, isClaimed: true,
    categories: [
      { label: 'Atendimento', value: 4.4 }, { label: 'Pedagogia', value: 4.7 },
      { label: 'Estrutura', value: 4.3 }, { label: 'Segurança', value: 4.5 },
      { label: 'Comunicação', value: 4.2 }, { label: 'Inclusão', value: 3.5 },
      { label: 'Custo-benefício', value: 4.5 }, { label: 'Alimentação', value: 4.0 },
      { label: 'Extracurricular', value: 4.2 },
    ],
    description: 'Tradição de décadas em vestibular e aprovações nos melhores cursos do país.',
    phone: '(19) 3456-7890', website: 'https://objetivo-campinas.com.br',
    photos: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'],
    highlights: ['Top aprovações UNICAMP', 'Laboratório completo', 'Cursinho integrado'],
  },
  {
    id: '5', name: 'CIEP Anísio Teixeira', slug: 'ciep-anisio-teixeira',
    type: 'estadual', stages: ['fundamental'],
    address: 'Rua das Laranjeiras, 500', city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Laranjeiras',
    lat: -22.937, lng: -43.178, rating: 4.1, reviewCount: 55,
    avgPrice: 0, priceMin: 0, priceMax: 0,
    isVerified: false, isAutismFriendly: false, isClaimed: false,
    categories: [
      { label: 'Atendimento', value: 4.0 }, { label: 'Pedagogia', value: 4.3 },
      { label: 'Estrutura', value: 3.8 }, { label: 'Segurança', value: 4.0 },
      { label: 'Comunicação', value: 3.7 }, { label: 'Inclusão', value: 4.5 },
      { label: 'Custo-benefício', value: 5.0 }, { label: 'Alimentação', value: 4.2 },
      { label: 'Extracurricular', value: 3.5 },
    ],
    description: 'Centro Integrado de Educação Pública com proposta pedagógica inovadora.',
    phone: '(21) 3456-7890', website: '',
    photos: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'],
    highlights: ['Gratuita', 'Período integral', 'Atividades culturais'],
  },
  {
    id: '6', name: 'Escola Waldorf Dendê', slug: 'escola-waldorf-dende',
    type: 'particular', stages: ['infantil', 'fundamental'],
    address: 'Rua das Acácias, 88', city: 'Belo Horizonte', state: 'MG', neighborhood: 'Santa Teresa',
    lat: -19.931, lng: -43.940, rating: 4.8, reviewCount: 62,
    avgPrice: 2100, priceMin: 1800, priceMax: 2400,
    isVerified: true, isAutismFriendly: true, isClaimed: true,
    categories: [
      { label: 'Atendimento', value: 4.9 }, { label: 'Pedagogia', value: 4.8 },
      { label: 'Estrutura', value: 4.5 }, { label: 'Segurança', value: 4.9 },
      { label: 'Comunicação', value: 4.7 }, { label: 'Inclusão', value: 4.9 },
      { label: 'Custo-benefício', value: 4.3 }, { label: 'Alimentação', value: 4.6 },
      { label: 'Extracurricular', value: 4.8 },
    ],
    description: 'Pedagogia Waldorf com foco no desenvolvimento artístico, emocional e intelectual.',
    phone: '(31) 3456-7890', website: 'https://waldorfdende.com.br',
    photos: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'],
    highlights: ['Pedagogia Waldorf', 'Horta escolar', 'Sem provas tradicionais'],
  },
];

export const REVIEWS: Review[] = [
  {
    id: 'r1', schoolId: '1', authorName: 'Ana Paula M.', authorAvatar: '',
    isAnonymous: false, rating: 5,
    categories: [
      { label: 'Atendimento', value: 5 }, { label: 'Pedagogia', value: 5 },
      { label: 'Estrutura', value: 4 }, { label: 'Segurança', value: 5 },
    ],
    comment: 'Meu filho está no 7º ano e a evolução dele foi notável. Os professores são muito dedicados e a coordenação sempre disponível para conversar.',
    pros: 'Professores excelentes, comunicação com pais frequente, boa estrutura.',
    cons: 'Cantina poderia ter opções mais saudáveis.',
    wouldRecommend: true, monthlyFee: 2750, stage: 'Fundamental II', year: 2024, createdAt: '2024-03-15', helpful: 24,
  },
  {
    id: 'r2', schoolId: '1', authorName: 'Pai anônimo', authorAvatar: '',
    isAnonymous: true, rating: 4,
    categories: [
      { label: 'Atendimento', value: 4 }, { label: 'Pedagogia', value: 5 },
      { label: 'Estrutura', value: 4 }, { label: 'Custo-benefício', value: 3 },
    ],
    comment: 'Escola muito boa academicamente. O preço é alto mas a qualidade de ensino compensa. Minha filha passou em excelentes colégios de segundo grau.',
    pros: 'Excelente preparação acadêmica, ambiente seguro.',
    cons: 'Mensalidade elevada, reajuste acima da inflação todo ano.',
    wouldRecommend: true, monthlyFee: 2900, stage: 'Fundamental II', year: 2023, createdAt: '2024-01-22', helpful: 18,
  },
  {
    id: 'r3', schoolId: '1', authorName: 'Carlos e Mariana S.', authorAvatar: '',
    isAnonymous: false, rating: 5,
    categories: [
      { label: 'Inclusão', value: 5 }, { label: 'Atendimento', value: 5 },
      { label: 'Pedagogia', value: 4 }, { label: 'Comunicação', value: 5 },
    ],
    comment: 'Nosso filho tem TEA e a escola foi acolhedora desde o primeiro dia. A equipe de inclusão é preparada e o acompanhamento é constante.',
    pros: 'Equipe de inclusão excelente, comunicação diária com os pais.',
    cons: 'Poderia ter mais profissionais de apoio em sala.',
    wouldRecommend: true, monthlyFee: 2800, stage: 'Fundamental I', year: 2024, createdAt: '2024-04-02', helpful: 41,
  },
];

export const PROFESSIONALS: Professional[] = [
  {
    id: 'p1', name: 'Dra. Fernanda Costa', specialty: 'Psicopedagoga',
    city: 'São Paulo', state: 'SP', modality: 'ambos',
    rating: 4.9, reviewCount: 87, pricePerSession: 180,
    bio: 'Especialista em dificuldades de aprendizagem e inclusão escolar com 12 anos de experiência.',
    avatar: 'https://ui-avatars.com/api/?name=Fernanda+Costa&background=FFF0E5&color=1B2D5B&size=128',
    tags: ['Dislexia', 'TDAH', 'TEA', 'Inclusão'], specialties: ['Dislexia', 'TDAH', 'TEA', 'Inclusão'],
    phone: '(11) 99999-1111', whatsapp: '5511999991111', website: 'https://fernandacosta.com.br', isVerified: true,
  },
  {
    id: 'p2', name: 'Dr. Ricardo Alves', specialty: 'Psicólogo',
    city: 'São Paulo', state: 'SP', modality: 'ambos',
    rating: 4.8, reviewCount: 112, pricePerSession: 200,
    bio: 'Psicólogo clínico especializado em crianças e adolescentes. Terapia cognitivo-comportamental.',
    avatar: 'https://ui-avatars.com/api/?name=Ricardo+Alves&background=FFF0E5&color=1B2D5B&size=128',
    tags: ['Ansiedade', 'TDAH', 'Adolescentes', 'TCC'], phone: '(11) 99999-2222', whatsapp: '5511999992222',
  },
  {
    id: 'p3', name: 'Ana Luíza Mendes', specialty: 'Fonoaudióloga',
    city: 'Rio de Janeiro', state: 'RJ', modality: 'presencial',
    rating: 4.7, reviewCount: 64, pricePerSession: 160,
    bio: 'Fonoaudióloga com foco em linguagem, fala e comunicação alternativa para crianças com TEA.',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Mendes&background=FFF0E5&color=1B2D5B&size=128',
    tags: ['Fala', 'TEA', 'Linguagem', 'CAA'], phone: '(21) 99999-3333', whatsapp: '5521999993333',
  },
  {
    id: 'p4', name: 'Prof. Marcos Lima', specialty: 'Professor Particular',
    city: 'Belo Horizonte', state: 'MG', modality: 'online',
    rating: 4.6, reviewCount: 45, pricePerSession: 90,
    bio: 'Professor de Matemática e Física para Ensino Médio e pré-vestibular. Online para todo o Brasil.',
    avatar: 'https://ui-avatars.com/api/?name=Marcos+Lima&background=FFF0E5&color=1B2D5B&size=128',
    tags: ['Matemática', 'Física', 'Vestibular', 'ENEM'], phone: '(31) 99999-4444', whatsapp: '5531999994444',
  },
];

export function getSchoolById(id: string): School | undefined {
  return SCHOOLS.find(s => s.id === id || s.slug === id);
}

export function getReviewsBySchool(schoolId: string): Review[] {
  return REVIEWS.filter(r => r.schoolId === schoolId);
}
