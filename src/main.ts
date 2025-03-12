import { Core } from "@lib/core/core";
import { Build } from "@lib/modules/build";
import { Components } from "@lib/modules/components";



const core = new Core()
const components = new Components(core)
const build = new Build(core)

core.init()
