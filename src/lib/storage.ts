import type { WizardInputs } from "@/types/wizard";

export interface StoredProject {
  id: string;
  name: string;
  status: "draft" | "complete" | "error";
  inputs: Partial<WizardInputs>;
  outputs: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

const KEY = "cf_projects";

function readAll(): StoredProject[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as StoredProject[];
  } catch {
    return [];
  }
}

function writeAll(projects: StoredProject[]) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

export function getProjects(): StoredProject[] {
  return readAll().sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function getProject(id: string): StoredProject | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function saveProject(project: StoredProject): void {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx === -1) {
    writeAll([...all, project]);
  } else {
    all[idx] = project;
    writeAll(all);
  }
}

export function newProject(name: string, inputs: Partial<WizardInputs>): StoredProject {
  return {
    id: crypto.randomUUID(),
    name,
    status: "draft",
    inputs,
    outputs: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function patchProject(
  id: string,
  patch: Partial<Omit<StoredProject, "id" | "created_at">>
): void {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...patch, updated_at: new Date().toISOString() };
  writeAll(all);
}

export function deleteProject(id: string): void {
  writeAll(readAll().filter((p) => p.id !== id));
}
