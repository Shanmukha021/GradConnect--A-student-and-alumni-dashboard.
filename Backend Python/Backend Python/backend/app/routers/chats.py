
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from ..database import get_db
from ..models.chats import Chat
from ..schemas.chats import ChatCreate, ChatUpdate, ChatResponse

router = APIRouter()

@router.get("/", response_model=list[ChatResponse])
async def list_chats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Chat))
    chats = result.scalars().all()
    chat_list = []
    for chat in chats:
        chat_dict = chat.__dict__.copy()
        if "created_at" in chat_dict and hasattr(chat_dict["created_at"], "isoformat"):
            chat_dict["created_at"] = chat_dict["created_at"].isoformat()
        chat_list.append(chat_dict)
    return chat_list

@router.post("/", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def create_chat(chat: ChatCreate, db: AsyncSession = Depends(get_db)):
    db_chat = Chat(**chat.model_dump())
    db.add(db_chat)
    await db.commit()
    await db.refresh(db_chat)
    chat_dict = db_chat.__dict__.copy()
    if "created_at" in chat_dict and hasattr(chat_dict["created_at"], "isoformat"):
        chat_dict["created_at"] = chat_dict["created_at"].isoformat()
    return chat_dict

@router.get("/{chat_id}", response_model=ChatResponse)
async def get_chat(chat_id: UUID, db: AsyncSession = Depends(get_db)):
    chat = await db.get(Chat, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.put("/{chat_id}", response_model=ChatResponse)
async def update_chat(chat_id: UUID, update: ChatUpdate, db: AsyncSession = Depends(get_db)):
    chat = await db.get(Chat, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(chat, key, value)
    await db.commit()
    await db.refresh(chat)
    return chat

@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(chat_id: UUID, db: AsyncSession = Depends(get_db)):
    chat = await db.get(Chat, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    await db.delete(chat)
    await db.commit()
    return None
