from __future__ import annotations

from abc import ABC, abstractmethod

from app.schemas import ScoreData


class AIProvider(ABC):
    @abstractmethod
    async def score(self, prompt: str) -> ScoreData:
        raise NotImplementedError
