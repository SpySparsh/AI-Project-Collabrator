import { WebContainer } from "@webcontainer/api";

let WebContainerInstance = null;

export const getWebContainerInstance = async () => {
  if (!WebContainerInstance) {
    console.log("🖥️ Attempting to boot WebContainer...");
    try {
      WebContainerInstance = await WebContainer.boot();
      console.log("✅ WebContainer successfully initialized!");
    } catch (error) {
      console.error("❌ WebContainer boot failed:", error);
    }
  }
  return WebContainerInstance;
};
