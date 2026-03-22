const HL_BASE_URL = "https://services.leadconnectorhq.com";
const HL_VERSION = "2021-07-28";

export async function hlFetch(
  path: string,
  apiKey: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${HL_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: HL_VERSION,
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    },
  });
}
