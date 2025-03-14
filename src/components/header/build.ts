import { Component } from "@lib/classes/component";

import fs from 'fs'
import path from "path";

class Header extends Component {

  build() {
    const base = this.readFile("src/base.html")
    const link = this.readFile("src/link.html")

    const output = this.replace(base, "link", link)

    this.output(output)
  }

}

new Header()
