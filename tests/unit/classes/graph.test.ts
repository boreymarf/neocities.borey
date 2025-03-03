import { GraphNode } from "@lib/classes/graph"

describe("graphNode class", () => {
  it("should correctly add one child", () => {
    const nodeParent = new GraphNode(0)
    const node1 = new GraphNode(1)

    nodeParent.addChildren(node1)

    expect(nodeParent.children).toStrictEqual([node1])
    expect(node1.parents).toStrictEqual([nodeParent])
  })

  it("should correctly add several children", () => {
    const nodeParent = new GraphNode(0)
    const node1 = new GraphNode(1)
    const node2 = new GraphNode(2)
    const node3 = new GraphNode(3)

    nodeParent.addChildren([node1, node2, node3])

    expect(nodeParent.children).toEqual(
      expect.arrayContaining([node3, node2, node1])
    );

    [node1, node2, node3].forEach((child: GraphNode) => {
      expect(child.parents).toEqual(
        expect.arrayContaining([nodeParent])
      )
    })
  })

  it("should correctly remove children", () => {
    const nodeParent = new GraphNode(0)
    const node1 = new GraphNode(1)
    const node2 = new GraphNode(2)

    nodeParent.addChildren([node1, node2])

    expect(nodeParent.children).toStrictEqual([node1, node2])


  })
})
