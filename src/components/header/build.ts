import { Component } from "@lib/classes/component.js";
import { replace } from "@lib/utils/text.js";

class Header extends Component {

  build() {
    const base = this.readFile("src/base.html")
    const link = this.readFile("src/link.html")
    const output = replace(base, "link", link)

    this.output({ html: output })
  }

}

new Header()
