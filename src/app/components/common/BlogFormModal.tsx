"use client";

import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CkEditor from "./CKEditor";

const BlogFormModal = () => {
  const [editorData, setEditorData] = useState<string>("");
  const [data, setData] = useState<string>("");

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      console.log("Editor data field:", editor);
      setData(editor);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus />
          <span>Create new post</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[80%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Create a new post</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="">
              <h1>Title</h1>
            </div>
            <div className="max-w-3xl mx-auto">
              <CkEditor
                editorData={editorData}
                setEditorData={setEditorData}
                handleOnUpdate={handleOnUpdate}
              />
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: data }}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlogFormModal;
