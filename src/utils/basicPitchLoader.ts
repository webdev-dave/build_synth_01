import type { BasicPitch } from "@spotify/basic-pitch";

let modelPromise: Promise<BasicPitch> | null = null;

export async function getBasicPitchModel(): Promise<BasicPitch> {
  if (!modelPromise) {
    modelPromise = (async () => {
      const mod = await import("@spotify/basic-pitch");
      // The package exports class BasicPitch
      const modelUrl =
        "https://cdn.jsdelivr.net/npm/@spotify/basic-pitch@1.0.1/model/model.json";
      const model = new mod.BasicPitch(modelUrl);
      return model;
    })();
  }
  return modelPromise;
}
