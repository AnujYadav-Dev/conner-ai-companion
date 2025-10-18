const API_URL = import.meta.env.CONNER_BACKEND_URL;

export async function sendToConner(message, contextWindow, personality = 'supportive') {
    if (!API_URL) throw new Error("Backend URL not configured");
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, contextWindow, personality }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.error || "Request failed");
    }
    return data;
}


