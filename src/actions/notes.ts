"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/Prisma";
import { handleError } from "@/lib/utils";
import openai from "@/openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";
export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    console.log("noteId", noteId);
    console.log("text", text);
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.note.update({
      where: { id: noteId },
      data: { text: text },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.note.create({
      data: {
        id: noteId,
        text: "",
        authorId: user.id,
      },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  const user = await getUser();
  if (!user) {
    throw new Error("you must be logged in to ask AI about notes");
  }
  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: {
      createdAt: "desc",
    },
    select: { text: true, createdAt: true, updatedAt: true },
  });
  if (notes.length === 0) {
    throw new Error("you must have at least one note to ask AI about notes");
  }
  const formattedNotes = notes
    .map((note) =>
      `Text:${note.text}
      Created At:${note.createdAt}
      Last Updated:${note.updatedAt},

      `.trim(),
    )
    .join("\n");

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "developer",
      content: `
              You are a helpful assistant that answers questions about a user's notes. 
              Assume all questions are related to the user's notes. 
              Make sure that your answers are not too verbose and you speak succinctly. 
              Your responses MUST be formatted in clean, valid HTML with proper structure. 
              Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
              Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
              Avoid inline styles, JavaScript, or custom attributes.
              
              Rendered like this in JSX:
              <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
        
              Here are the user's notes:
              ${formattedNotes}
              `,
    },
  ];

  for (let i = 0; i < newQuestions.length; i++) {
    messages.push({ role: "user", content: newQuestions[i] });
    if (responses.length > i) {
      messages.push({ role: "assistant", content: responses[i] });
    }
  }
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });
  return completion.choices[0].message.content || "A problem has occured";
 
};
