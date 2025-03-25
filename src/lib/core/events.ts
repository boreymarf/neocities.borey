import { IComponent } from "@lib/modules/components.js";

export interface AppEvents {

  // Core
  "core:ready": undefined;

  // Components
  "components:ready": undefined;
  "component:changed": { component: IComponent };

  // Build
  "build:complete": { duration: number };

  // Blog
  "blog:post-added": { id: string; content: string };
  "blog:build-started": void;
}
