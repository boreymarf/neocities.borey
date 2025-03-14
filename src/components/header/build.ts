import { Component } from "@lib/classes/component";
import { replace } from "@lib/utils/text";

import fs from 'fs'
import path from "path";

class Header extends Component {

  build() {
    const base = this.readFile("src/base.html")
    const link = this.readFile("src/link.html")
    const output = replace(base, "link", link)

    this.output(output)
  }

}

new Header()
