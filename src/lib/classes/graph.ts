export class GraphNode {
  id: number
  static nextId: number = 1
  value: any
  parents: GraphNode[]
  children: GraphNode[]
  //uniqueValuesOnly: boolean

  constructor(value: any) {
    this.id = GraphNode.nextId++
    this.value = value
    this.parents = []
    this.children = []
  }

  // TODO: Позже сделать возможность добавлять узлы только с уникальными значениями.
  // TODO: Так же сделать тест для этого.
  // TODO: Сделать выбросы ошибок.
  public addChildren(children: GraphNode | GraphNode[]): void {

    const nodes = Array.isArray(children) ? children : [children];

    for (const node of nodes) {
      if (!this.children.includes(node)) {
        this.children.push(node);
        node.parents.push(this);
      }
    }
  }

  public removeChildren(children: GraphNode | GraphNode[]): void {

    const nodes = Array.isArray(children) ? children : [children];

    for (const node of nodes) {
      if (this.children.includes(node)) {
        this.children = this.children.filter((child) => child.id !== node.id);
        node.parents = node.parents.filter((child) => child.id !== node.id);
      }
    }
  }

  public addParents(parents: GraphNode | GraphNode[]): void {
    const nodes = Array.isArray(parents) ? parents : [parents];

  }

  public removeParents(parents: GraphNode | GraphNode[]): void {
    const nodes = Array.isArray(parents) ? parents : [parents];

  }
}
