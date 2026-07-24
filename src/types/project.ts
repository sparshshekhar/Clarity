// src/types/project.ts
export type ProjectVisibility = "active" | "past" | "public";

export type Project = {
  id: string;
  name: string;
  team: string;
  visibility: ProjectVisibility;
  updatedAt: string;
  hasAlert?: boolean;
};
