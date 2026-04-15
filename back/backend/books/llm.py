import requests

def ask_llm(prompt):
    url = "http://127.0.0.1:1234/v1/responses"

    data = {
        "model": "mistral-7b-instruct-v0.2",
        "input": prompt
    }

    try:
        # 🔥 Increase timeout
        response = requests.post(url, json=data, timeout=60)

        result = response.json()

        print("LLM RESPONSE:", result)  # debug

        # ✅ FORMAT 1 (LM Studio latest)
        if "output" in result:
            return result["output"][0]["content"][0]["text"]

        # ✅ FORMAT 2 (fallback)
        if "response" in result:
            return result["response"]

        # ✅ FORMAT 3 (chat completions fallback)
        if "choices" in result:
            return result["choices"][0]["message"]["content"]

        return "⚠️ AI response not available"

    except requests.exceptions.Timeout:
        return "❌ LLM Timeout: Model is slow. Try again."

    except Exception as e:
        return f"❌ LLM Error: {str(e)}"