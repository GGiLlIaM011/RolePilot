import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());
app.use(fileUpload());

// API Routes
app.post("/api/parse-resume", async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      console.error("No file in request");
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    const resumeFile = req.files.resume as any;
    console.log("Neural Core: Processing resume file:", resumeFile.name, "Size:", resumeFile.size);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: resumeFile.data.toString("base64")
            }
          },
          {
            text: `Parse this resume comprehensively. 
            Identify the candidate's actual seniority level based on years of experience, titles, and responsibilities.
            BE EXTREMELY ACCURATE about seniority. If they have less than 3 years of experience, they are likely Junior. 3-6 years is Mid. 7+ is Senior.
            Return a structured JSON object.
            Include: fullName, summary, skills (array), workHistory (array of objects with title, company, dates, achievements), education (array), seniorityLevel (e.g. Junior, Mid, Senior, Lead).`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            summary: { type: Type.STRING },
            seniorityLevel: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            workHistory: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  dates: { type: Type.STRING },
                  achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  year: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text || "";
    if (!text) {
      throw new Error("Neural Core synchronization failure: Empty response");
    }

    const result = JSON.parse(text);
    console.log("Successfully synchronized profile for:", result.fullName);
    res.json(result);
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Dynamic Job Data endpoint based on user profile
app.post("/api/jobs", async (req, res) => {
  const { profile } = req.body;
  
  if (!profile) {
    // Return standard generic feed if no profile yet
    return res.json([
      {
        id: "1",
        title: "Product Designer",
        company: "DesignCo",
        location: "Hybrid",
        salary: "$90k - $130k",
        type: "Full-time",
        matchScore: 85,
        postedAt: new Date().toISOString(),
        description: "Join our growing design team..."
      },
      {
        id: "2",
        title: "Frontend Developer",
        company: "TechPulse",
        location: "Remote",
        salary: "$100k - $140k",
        type: "Contract",
        matchScore: 78,
        postedAt: new Date().toISOString(),
        description: "Building modern React applications..."
      }
    ]);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 realistic job matches based on the following candidate profile. 
      STRICT SENIORITY ENFORCEMENT: The jobs MUST align with the candidate's identified seniority: ${profile.seniorityLevel || 'Junior'}.
      - If Junior: Suggest roles like "Junior ...", "Associate ...", or roles requiring 0-2 years experience.
      - If Mid: Suggest roles requiring 3-6 years experience.
      - If Senior: Suggest roles requiring 7+ years experience.
      NEVER suggest a role more than one level above their current status.
      
      Return as a JSON array of objects with: id, title, company, location, salary, type, matchScore (0-100), postedAt (ISO), description.

      Candidate Profile: ${JSON.stringify(profile)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              salary: { type: Type.STRING },
              type: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              postedAt: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text || "";
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    if (!cleanJson) throw new Error("Neural core returned empty response");
    
    try {
      res.json(JSON.parse(cleanJson));
    } catch (parseError) {
      console.error("Malformed JSON from Gemini:", cleanJson);
      throw new Error("Neural output synchronization failure");
    }
  } catch (error: any) {
    console.error("Job generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/analyze-career", async (req, res) => {
  try {
    const { profile, preferences } = req.body;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a senior career strategist. Analyze this user's profile and preferences. 
      Predict a 4-step career roadmap starting from their CURRENT position.
      
      Return a JSON object with:
      1. pathSteps: Array of 4 objects {id, role, date, salary, status (active/next/goal/peak), focus (string explanation)}
      2. adjacentPivots: Array of 3 objects {role, reason, fit (0-100), color}
      
      Profile: ${JSON.stringify(profile)}
      Preferences: ${JSON.stringify(preferences)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pathSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  role: { type: Type.STRING },
                  date: { type: Type.STRING },
                  salary: { type: Type.STRING },
                  status: { type: Type.STRING },
                  focus: { type: Type.STRING }
                }
              }
            },
            adjacentPivots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  fit: { type: Type.NUMBER },
                  color: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text || "";
    if (!text) throw new Error("Neural Core returned empty roadmap");
    res.json(JSON.parse(text));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const { messages, context } = req.body;
  
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are RolePilot Copilot, a senior career coach. 
        Context about the user: ${JSON.stringify(context)}. 
        Help them with resume edits, cover letters, interview prep, and career advice. 
        Be professional, supportive, and data-driven.`
      }
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage({ message: lastMessage.content });
    res.json({ content: result.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
