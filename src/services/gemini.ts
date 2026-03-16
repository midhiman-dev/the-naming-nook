import { PetNamingResponse, NamingRequest } from "../types";

export async function suggestPetNames(request: NamingRequest): Promise<PetNamingResponse> {
  const response = await fetch("/api/suggest-names", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate names");
  }

  return response.json();
}

export function createPetNamingChat() {
  // We'll handle the actual chat instance on the server
  // This client-side "chat" will just be a proxy
  return {
    sendMessage: async ({ message }: { message: string }) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }

      return response.json();
    }
  };
}
