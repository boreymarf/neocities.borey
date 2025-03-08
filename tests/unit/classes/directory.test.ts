import { logger } from "@lib/utils/logging"
import { Directory, IDirectory, IFile } from "@lib/classes/directory"

// Mocking logger
logger.mockTypes((_typeName, _type) => jest.fn());

describe("Directory class", () => {
  it("should add a child file to the directory", () => {
    const root: IDirectory = new Directory();
    const child: IFile = {
      name: "child",
      content: "child_content",
    };

    root.add(child);

    expect(root.child).toStrictEqual(child);
  });

  it("should return undefined when accessing a child from an empty directory", () => {
    const root: IDirectory = new Directory();

    const output = root.child;

    expect(output).toBeUndefined();
  });
});
