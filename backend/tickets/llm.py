import os,json,re
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

PROMPT = """
Classify support ticket.
Return ONLY JSON:
{
 "category": billing|technical|account|general,
 "priority": low|medium|high|critical
}
"""

VALID_CATS = ["billing","technical","account","general"]
VALID_PRIOS = ["low","medium","high","critical"]

def extract_json(text):
    match=re.search(r"\{.*\}",text,re.DOTALL)
    return match.group(0) if match else None

def classify_ticket(desc):
    try:
        model=genai.GenerativeModel("gemini-1.5-flash")
        res=model.generate_content(PROMPT+"\n"+desc)
        js=extract_json(res.text)
        if not js:
            return None
        data=json.loads(js)

        if data.get("category") not in VALID_CATS:
            data["category"]="general"
        if data.get("priority") not in VALID_PRIOS:
            data["priority"]="low"

        return data
    except:
        return None
