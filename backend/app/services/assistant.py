import os
import re

from fastapi import HTTPException
from openai import AsyncOpenAI, OpenAIError, RateLimitError

from app.schemas.assistant import AssistantRequest, AssistantReply
from app.services.assistant_context import SYSTEM_INSTRUCTIONS, EMERGENCY_MESSAGE

UNAVAILABLE = "Thaai is taking a short break right now. You can still use Journey, Safe Hubs, Report, Community and Emergency Help."
# A fast, conservative fallback for common urgent wording, even without a provider key.
# This does not detect every emergency; the model also receives emergency instructions.
URGENT = re.compile(r"\b(emergency|immediate danger|in danger|being followed|following me|attacking|attacked|threatening|help me now|not safe|unsafe right now|can't breathe|cannot breathe|bleeding|hurt myself|kill myself|assault|sos)\b", re.I)

async def answer(request: AssistantRequest) -> AssistantReply:
    if URGENT.search(request.message):
        return AssistantReply(message=EMERGENCY_MESSAGE)
    key = os.environ.get('OPENAI_API_KEY', '').strip()
    if not key:
        raise HTTPException(status_code=503, detail=UNAVAILABLE)
    model = os.environ.get('OPENAI_MODEL', '').strip() or 'gpt-5.6-luna'
    messages = [item.model_dump() for item in request.history[-10:]]
    messages.append({'role': 'user', 'content': request.message})
    try:
        async with AsyncOpenAI(api_key=key, timeout=25.0, max_retries=0) as client:
            result = await client.responses.create(
                model=model,
                instructions=SYSTEM_INSTRUCTIONS + '\nCurrent page: ' + request.current_path,
                input=messages,
                store=False,
                max_output_tokens=700,
            )
        text = result.output_text.strip()
        if not text or result.status != 'completed':
            raise HTTPException(status_code=503, detail=UNAVAILABLE)
        return AssistantReply(message=text[:2000])
    except RateLimitError:
        raise HTTPException(status_code=429, detail='Thaai is busy right now. Please try again shortly. Emergency Help remains available.') from None
    except OpenAIError:
        # Provider errors may contain sensitive diagnostics. Never return or log them.
        raise HTTPException(status_code=503, detail=UNAVAILABLE) from None
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=503, detail=UNAVAILABLE) from None
