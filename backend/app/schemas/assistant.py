from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

AppPath = Literal['/', '/journey', '/safe-hubs', '/report', '/community', '/emergency', '/about']

class ConversationMessage(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra='forbid')
    role: Literal['user', 'assistant']
    content: str = Field(min_length=1, max_length=2000)

class AssistantRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra='forbid')
    message: str = Field(min_length=1, max_length=2000)
    history: list[ConversationMessage] = Field(default_factory=list, max_length=10)
    current_path: AppPath = '/'

class AssistantReply(BaseModel):
    message: str
