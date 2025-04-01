"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2,  Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deleteNoteAction } from "@/actions/notes";
type Props = {
  noteId: string;
  deleteNoteLocally: (noteId: string) => void;
};
function DeleteNoteButton({ noteId, deleteNoteLocally }: Props) {

    const router = useRouter()
    const [isPending, startTransition] = useTransition();
    const noteIdParam =  useSearchParams().get("noteId") || ""
const handleDeleteNote =  () => {
    startTransition(async ()=>{
        const {errorMessage}= await deleteNoteAction(noteId)
        if (!errorMessage) {
            toast.success("Note deleted successfully!");

            deleteNoteLocally(noteId)
            if(noteId===noteIdParam){
                router.replace("/")
            }
        }else{
        
            toast.error(errorMessage,{
                description: "error deleting note",})
            }
        })
    }


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} className="[&_svg]:size-3 absolute right-2 top-1/2 -translate-y-1/2 size-7 opacity-0 group-hover/item:opacity-100 p-0">
        <Trash2/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure you want to delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            note from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteNote} className="bg-destructive text-destructive-foreground 
          hover:bg-destructive/90 w-24">
            {isPending ?<Loader2 className="animate-spin" /> : "Delete"}

          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteNoteButton;
