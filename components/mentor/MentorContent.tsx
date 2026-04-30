// app/mentores/[id]/MentorContent.tsx
import { Badge } from '@/components/ui/badge';
import { Mentor } from '@/types/mentorship';

export default function MentorContent({ mentor }: { mentor: Mentor }) {
    return (
        <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <h2 className="text-2xl font-bold mb-4">Sobre</h2>
                <div className="prose dark:prose-invert max-w-none">
                    {mentor.bio.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 text-gray-700 dark:text-gray-300">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <h2 className="text-2xl font-bold mb-4">Áreas</h2>
                <div className="flex flex-wrap gap-2">
                    {mentor.areas.map(category => (
                        <Badge key={category} className="bg-primary text-primary-foreground px-3 py-1">
                            {category}
                        </Badge>
                    ))}
                </div>
            </section>
        </div>
    );
}