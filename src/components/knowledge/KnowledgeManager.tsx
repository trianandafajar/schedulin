"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, BookOpen, Pencil } from "lucide-react";
import {
  addKnowledgeEntry,
  deleteKnowledgeEntry,
  updateKnowledgeEntry,
  type KnowledgeEntry,
} from "@/actions/knowledge-base";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

interface Props {
  initialEntries: KnowledgeEntry[];
}

type ModalMode = "add" | "edit";

export default function KnowledgeManager({ initialEntries }: Props) {
  const router = useRouter();
  const [entries, setEntries] = useState<KnowledgeEntry[]>(initialEntries);
  const { isOpen, openModal, closeModal } = useModal();
  const [mode, setMode] = useState<ModalMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  const resetForm = () => {
    setTitle("");
    setContent("");
    setError(null);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setMode("add");
    openModal();
  };

  const handleOpenEdit = (entry: KnowledgeEntry) => {
    const entryTitle =
      (entry.metadata && (entry.metadata as any).title) || "";
    setTitle(entryTitle);
    setContent(entry.content);
    setEditingId(entry.id);
    setError(null);
    setMode("edit");
    openModal();
  };

  const handleClose = () => {
    if (saving) return;
    closeModal();
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSaving(true);
    setError(null);

    if (mode === "add") {
      const res = await addKnowledgeEntry(content, title || undefined);
      setSaving(false);

      if (res.error) {
        setError(res.error);
        return;
      }

      setEntries((prev) => [
        {
          id: `temp-${Date.now()}`,
          content: content.trim(),
          metadata: title ? { title } : {},
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    } else if (editingId) {
      const res = await updateKnowledgeEntry(editingId, content, title || undefined);
      setSaving(false);

      if (res.error) {
        setError(res.error);
        return;
      }

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                content: content.trim(),
                metadata: title ? { title } : {},
              }
            : entry
        )
      );
    }

    closeModal();
    resetForm();
    startTransition(() => router.refresh());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const res = await deleteKnowledgeEntry(id);
    if (res.error) {
      alert(res.error);
      return;
    }
    setEntries((prev) => prev.filter((e) => e.id !== id));
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#313131] dark:bg-[#111111]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white">
              Knowledge Entries
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#e2e2e2]">
              {entries.length} entries saved. Examples: cancellation policy, special opening hours, parking info, promo packages, customer FAQs.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" />
            Add Knowledge
          </button>
        </div>

        <div className="mt-6">
          {entries.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500">
                No knowledge yet. Click &quot;Add Knowledge&quot; to add one.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {entries.map((entry) => {
                const entryTitle =
                  (entry.metadata && (entry.metadata as any).title) || null;
                const isTemp = entry.id.startsWith("temp-");
                return (
                  <li
                    key={entry.id}
                    className="rounded-lg border border-gray-100 p-4 dark:border-[#313131]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        {entryTitle && (
                          <p className="mb-1 font-medium text-gray-800 dark:text-white">
                            {entryTitle}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-[#e2e2e2]">
                          {entry.content}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          {new Date(entry.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(entry)}
                          disabled={isTemp}
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-[#e2e2e2] dark:hover:bg-[#313131] dark:hover:text-white disabled:opacity-40"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={isTemp}
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-160 p-5 lg:p-8"
      >
        <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white">
          {mode === "add" ? "Add Knowledge" : "Edit Knowledge"}
        </h4>
        <p className="mb-5 text-sm text-gray-500 dark:text-[#e2e2e2]">
          {mode === "add"
            ? "Examples: cancellation policy, special opening hours, parking info, promo packages, customer FAQs."
            : "Update knowledge details. The AI will use the latest version."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Cancellation policy"
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              placeholder="Write the full information here. The more specific, the better the AI's answers."
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/20">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !content.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-400"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : mode === "add" ? (
                <>
                  <Plus className="h-4 w-4" />
                  Add Knowledge
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
