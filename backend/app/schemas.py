from __future__ import annotations

from typing import Optional, Union

from pydantic import BaseModel, Field


class ScoreRequest(BaseModel):
    task: str = Field(..., min_length=1)
    promptType: str = Field(..., min_length=1)
    transcript: str = Field(..., min_length=0)
    questionText: Optional[str] = None
    referenceAnswer: Optional[str] = None
    appLanguage: str = Field(default="en")


class FeedbackDetail(BaseModel):
    summary: str
    issues: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)
    example_fix: str = ""


class ScoreData(BaseModel):
    overall: int
    content: Optional[int] = None
    fluency: Optional[int] = None
    pronunciation: Optional[int] = None
    grammar: Optional[int] = None
    spelling: Optional[int] = None
    vocabulary: Optional[int] = None
    feedback: Union[str, FeedbackDetail]
    transcript: Optional[str] = None
    attemptId: Optional[str] = None
    audioPath: Optional[str] = None
    audioUrl: Optional[str] = None
    durationSeconds: Optional[float] = None
    transcriptWordCount: Optional[int] = None
    issueSummary: Optional[str] = None


class ScoreSuccessResponse(BaseModel):
    success: bool = True
    data: ScoreData


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
