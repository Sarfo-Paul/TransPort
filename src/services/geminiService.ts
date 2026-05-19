import { GoogleGenAI } from "@google/genai";
import { vehicles, shipments, drivers } from "../mockData";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function askLogisticsAssistant(prompt: string) {
  const model = "gemini-3-flash-preview";
  
  const context = `
    You are a logistics assistant for TransPort Logistics.
    Current Fleet Status:
    - Total Vehicles: ${vehicles.length}
    - Active: ${vehicles.filter(v => v.status === 'active').length}
    - Maintenance: ${vehicles.filter(v => v.status === 'maintenance').length}
    
    Current Shipments:
    - Total: ${shipments.length}
    - In-Transit: ${shipments.filter(s => s.status === 'in-transit').length}
    - Delayed: ${shipments.filter(s => s.status === 'delayed').length}
    
    Drivers:
    - Total: ${drivers.length}
    - On-Duty: ${drivers.filter(d => d.status === 'on-duty').length}
    
    Use this data to answer queries. Be professional, concise, and helpful.
    If asked about route optimization, suggest logical improvements based on status.
  `;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: [{ parts: [{ text: `${context}\n\nUser Question: ${prompt}` }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my logistics brain right now.";
  }
}
