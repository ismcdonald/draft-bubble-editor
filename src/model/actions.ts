export const loadProject = (owner: string, project: string) => ({
  type: "LoadProject",
  owner,
  project,
});
