#!/usr/bin/env python3
from pathlib import Path

p = Path("src/routes/groq-router.ts")
text = p.read_text(encoding="utf-8")

text = text.replace(
'import { GoogleGenerativeAI } from "@google/generative-ai";',
'import { groq, MODEL } from "./groq";'
)

text = text.replace(
"const genAI = getGeminiClient();",
"const client = getGroqClient();"
)

text = text.replace(
"const model = genAI.getGenerativeModel({",
"const model = MODEL;"
)

p.write_text(text, encoding="utf-8")
print("OK")
