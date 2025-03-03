export interface AppEvents {

  // Core
  "core:ready": undefined;

  // Components
  "components:ready": undefined;
  "component:changed": { name: string; dependencies: string[] };

  // Build
  "build:start": { pages: string[] };
  "build:complete": { duration: number };

  // Blog
  "blog:post-added": { id: string; content: string };
  "blog:build-started": void;
}
