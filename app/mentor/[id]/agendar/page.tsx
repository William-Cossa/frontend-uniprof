import { fetchMentorProfile } from "@/lib/actions/mentor-actions";
import { notFound } from "next/navigation";
import AgendarClient from "./AgendarClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AgendarPage({ params }: Props) {
  const { id } = await params;
  const mentor = await fetchMentorProfile(id);

  if (!mentor) return notFound();

  return <AgendarClient mentor={mentor} />;
}