"use client"
import { MentorCard } from '@/components/mentor/MentorCard';
import { MentorFilters, FilterState } from '@/components/mentor/MentorFilters';
import Container from '@/components/Container';
import { Mentor } from '@/types/mentorship';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ViewToggle } from '@/components/mentor/MentorCard';

interface MentoresPageProps {
  mentors: Mentor[];
  categories: string[];
}

export default function MentoresPage({ mentors, categories }: MentoresPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all-categories',
    location: 'all-locations',
    priceRange: 'all-prices',
    experience: 'all-experience',
    sessionType: 'all',
  });

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor =>
      (filters.search === '' ||
        mentor.nome_completo.toLowerCase().includes(filters.search.toLowerCase()) ||
        mentor.areas.some(cat => cat.toLowerCase().includes(filters.search.toLowerCase())) ||
        (mentor.cargo && mentor.cargo.toLowerCase().includes(filters.search.toLowerCase()))) &&
      (filters.category === 'all-categories' || mentor.areas.includes(filters.category)) &&
      (filters.experience === 'all-experience' || (
        filters.experience === '0-2' && mentor.experiencia_total_anos <= 2 ||
        filters.experience === '3-5' && mentor.experiencia_total_anos >= 3 && mentor.experiencia_total_anos <= 5 ||
        filters.experience === '5-10' && mentor.experiencia_total_anos >= 5 && mentor.experiencia_total_anos <= 10 ||
        filters.experience === '10+' && mentor.experiencia_total_anos > 10
      )) &&
      (filters.sessionType === 'all' ||
        (filters.sessionType === 'online' && mentor.is_online) ||
        (filters.sessionType === 'presencial' && mentor.is_local))
    );
  }, [mentors, filters]);

  return (
    <Container>
      <div className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Encontre Mentores Locais
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Conecte-se com profissionais experientes para acelerar
            sua carreira e desenvolvimento pessoal
          </p>
        </div>

        <div className="mb-8">
          <MentorFilters
            categories={categories}
            locations={[]}
            onFiltersChange={setFilters}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mentores Disponíveis
            </h2>
            <span className="text-gray-600 dark:text-gray-400">
              {filteredMentors.length} mentores encontrados
            </span>
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {filteredMentors.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }>
              {filteredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum mentor encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar os filtros para ver mais resultados
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}