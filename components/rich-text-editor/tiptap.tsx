"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";
import { useMemo } from "react";

const Tiptap = ({ field }: { field: any }) => {
  const initialContent = useMemo(() => {
    if (!field.value) return "<p>Previous Defined Description not Found!</p>";
    try {
      return JSON.parse(field.value);
    } catch {
      return "<p>Invalid content</p>";
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert",
      },
    },

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    immediatelyRender: false,

    content: initialContent,
  });

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      {/* <FloatingMenu editor={editor} /> */}
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
