
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from ..database import get_db
from ..models.chats import ChatParticipant
from ..schemas.chat_participants import ChatParticipantCreate, ChatParticipantUpdate, ChatParticipantResponse

router = APIRouter(prefix="/chat_participants", tags=["Chat Participants"])

@router.get("/", response_model=list[ChatParticipantResponse])
async def list_chat_participants(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ChatParticipant))
    return result.scalars().all()

@router.post("/", response_model=ChatParticipantResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_participant(participant: ChatParticipantCreate, db: AsyncSession = Depends(get_db)):
    db_participant = ChatParticipant(**participant.model_dump())
    db.add(db_participant)
    await db.commit()
    await db.refresh(db_participant)
    return db_participant

@router.get("/{participant_id}", response_model=ChatParticipantResponse)
async def get_chat_participant(participant_id: UUID, db: AsyncSession = Depends(get_db)):
    participant = await db.get(ChatParticipant, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Chat participant not found")
    return participant

@router.put("/{participant_id}", response_model=ChatParticipantResponse)
async def update_chat_participant(participant_id: UUID, update: ChatParticipantUpdate, db: AsyncSession = Depends(get_db)):
    participant = await db.get(ChatParticipant, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Chat participant not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(participant, key, value)
    await db.commit()
    await db.refresh(participant)
    return participant

@router.delete("/{participant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat_participant(participant_id: UUID, db: AsyncSession = Depends(get_db)):
    participant = await db.get(ChatParticipant, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Chat participant not found")
    await db.delete(participant)
    await db.commit()
    return None
