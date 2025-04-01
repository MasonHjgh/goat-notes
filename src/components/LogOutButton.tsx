"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logOutAction } from "@/actions/users";

function LogOutButton() {
  const [loading, setLoading] = useState(false);
    const router = useRouter();
  const handleLogOut = async () => {
    setLoading(true);
    const {errorMessage} = await logOutAction();
  
    if (!errorMessage) {
      toast.success("logged out", {
        description: "you have been successfuly logged out!",
      });
      router.push("/");
    }else{
        toast.error("Error", {
            description: errorMessage,
          });
    }
    setLoading(false);
  };
  return (
    <Button onClick={handleLogOut} variant="outline" className="w-24">
      {loading ? <Loader2 className="animate-spin"></Loader2> : "Logout"}
    </Button>
  );
}

export default LogOutButton;
