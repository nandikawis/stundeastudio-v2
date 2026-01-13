// Migrated mock data in the new EditorElement format
// This file contains the converted data from the old format to the new format
// Generated using migrateProjectData() from migrateData.ts

import { mockProjects } from "./mockData";
import { migrateProjects } from "./migrateData";

// Convert all existing projects to the new format
export const migratedProjects = migrateProjects(mockProjects);

// Export individual migrated project for easy access
export const migratedProject1 = migratedProjects['project-1'];

