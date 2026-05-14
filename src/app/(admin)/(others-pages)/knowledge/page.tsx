import KnowledgeManager from "@/components/knowledge/KnowledgeManager";
import { listKnowledgeEntries } from "@/actions/knowledge-base";

export default async function KnowledgePage() {
  const { data, error } = await listKnowledgeEntries();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c0c0c]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Knowledge Base
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-[#E2E2E2]">
            Global knowledge base. Add general information (how to book, platform policies, FAQs) that the AI will use when answering visitor questions on public booking pages.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/20">
            {error}
          </div>
        ) : (
          <KnowledgeManager initialEntries={data} />
        )}
      </div>
    </div>
  );
}
