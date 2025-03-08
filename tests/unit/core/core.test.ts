import { IFile } from "@lib/classes/directory"
import { Core } from "@lib/core/core"
import { logger } from "@lib/utils/logging";

// Mocking logger
logger.mockTypes((_typeName, _type) => jest.fn());

describe("core", () => {

  let core: Core

  beforeEach(() => {
    core = new Core()
  })

  it("should add a file and retrieve it correctly", () => {
    const file: IFile = {
      name: "something",
      content: "12345"
    }

    core.add(file, "components")

    const output = core.get("components/something")

    expect(output).toStrictEqual(file)
  })

  it("should throw an error when accessing a non-existent file directly", () => {
    expect(() => core.get("non-existent-file")).toThrow()
  })

  it("should throw an error when accessing a non-existent path", () => {
    expect(() => core.get("this/path/does/not/exist")).toThrow()
  })

  it("should throw an error when trying to access a file as a directory", () => {
    const file: IFile = {
      name: "file_not_a_dir",
      content: ""
    }

    core.add(file, "")

    expect(() => core.get("file_not_a_dir/file")).toThrow()
  })

})
