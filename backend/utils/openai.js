import "dotenv/config";

const getOpenAPIResponse=async(message)=>{
 try {
    let mess=message;
    console.log(mess);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: mess }],
  },
          ],
        }),
      }
    );

    const data = await response.json();

    
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
    } catch (error) {
    console.error("Gemini API error:", error);
  }
}

export default getOpenAPIResponse;