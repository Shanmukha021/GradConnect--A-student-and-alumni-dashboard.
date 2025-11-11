
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from ..database import get_db
from ..models.chats import Message
from ..schemas.messages import MessageCreate, MessageUpdate, MessageResponse

router = APIRouter(tags=["Messages"])

from fastapi import Query

@router.get("/", response_model=list[MessageResponse])
async def list_messages(chat_id: UUID = Query(None), db: AsyncSession = Depends(get_db)):
    query = select(Message)
    if chat_id:
        query = query.where(Message.chat_id == chat_id)
    result = await db.execute(query)
    messages = result.scalars().all()
    return messages

@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(message: MessageCreate, db: AsyncSession = Depends(get_db)):
    db_message = Message(**message.model_dump())
    db.add(db_message)
    await db.commit()
    await db.refresh(db_message)
    return db_message

@router.get("/{message_id}", response_model=MessageResponse)
async def get_message(message_id: UUID, db: AsyncSession = Depends(get_db)):
    message = await db.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

@router.put("/{message_id}", response_model=MessageResponse)
async def update_message(message_id: UUID, update: MessageUpdate, db: AsyncSession = Depends(get_db)):
    message = await db.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(message, key, value)
    await db.commit()
    await db.refresh(message)
    return message

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(message_id: UUID, db: AsyncSession = Depends(get_db)):
    message = await db.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    await db.delete(message)
    await db.commit()
    return None
