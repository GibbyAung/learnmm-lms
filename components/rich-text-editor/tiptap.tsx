"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";

const Tiptap = ({ field }: { field: any }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert",
      },
    },

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value
      ? JSON.parse(field.value)
      : "<p> Previous Defined Description not Found! </p>",
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
