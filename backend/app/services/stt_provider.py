from abc import ABC, abstractmethod
from typing import Optional


class STTProvider(ABC):
    @abstractmethod
    async def transcribe(
        self,
        audio_bytes: bytes,
        mime_type: str,
        sample_rate_hertz: Optional[int] = None,
        language_code: Optional[str] = None,
    ) -> str:
        raise NotImplementedError
