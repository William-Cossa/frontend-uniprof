import MentoresPage from "@/components/mentor/MentorPage";
import { fetchMentores, fetchAreasMentoria } from "@/lib/actions/mentor-actions";

export default async function Page() {
  const [mentores, categories] = await Promise.all([
    fetchMentores(),
    fetchAreasMentoria(),
  ]);

  return (
    <div className="pt-[8vh]">
      <MentoresPage mentors={mentores} categories={categories} />
    </div>
  );
}