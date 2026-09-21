from fastapi import APIRouter, Response
from app.schemas.assistant import AssistantRequest, AssistantReply
from app.services.assistant import answer

router = APIRouter()

@router.post('/assistant', response_model=AssistantReply)
async def ask_thaai(request: AssistantRequest, response: Response):
    response.headers['Cache-Control'] = 'no-store'
    return await answer(request)
