"use client";

import { DynamicField } from "@/components/Form/DynamicField";
import { ImageField } from "@/components/Form/ImageField";
import { InputField } from "@/components/Form/InputField";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Pen, Trash } from "lucide-react";
import Modal from "@/components/Modal";
import Link from "next/link";

type UserOptionProps = {
  id: string;
  username: string;
};

function UserOption({ id, username }: UserOptionProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    console.log("delete id", id);
    setIsDeleting(true);

    const toastDeleteUser = toast.loading("Loading...");

    // const deleteUrl = `/api/post?postId=${post.id}&imageId=${post.imageId}`;

    // const response = await fetch(deleteUrl, {
    //   method: "DELETE",
    // });

    const deleteUrl = `/api/admin/user`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deleteId: id }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("User Deleted", {
        id: toastDeleteUser,
      });
      router.refresh();
      router.replace("/admin/users");
      console.log("success", data);
    } else {
      toast.error("Something went wrong", {
        id: toastDeleteUser,
      });
      console.log("error", data);
    }

    setShowDeleteModal(false);
    setIsDeleting(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default">Option</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <Link href={`/user/${username}`} target="_blank">
            <DropdownMenuItem>
              <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              View in site
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
            <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        isPending={isDeleting}
        title={`Are you sure you want to delete user "${username}"?`}
        handleAction={handleDelete}
        color="bg-gray-50"
        colorDark="dark:bg-custom-gray6"
      />
    </>
  );
}

export default UserOption;
