"use client";

import React from "react";
import { Editor, useEditorState } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

interface MenubarProps {
  editor: Editor | null;
}

const ACTIVE_TOGGLE =
  "data-[state=on]:!bg-accent data-[state=on]:!text-accent-foreground data-[state=on]:!ring-1 data-[state=on]:!ring-ring";

export default function Menubar({ editor }: MenubarProps) {
  if (!editor) return null;

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      strike: editor.isActive("strike"),

      h1: editor.isActive("heading", { level: 1 }),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),

      bullet: editor.isActive("bulletList"),
      ordered: editor.isActive("orderedList"),

      alignLeft: editor.isActive({ textAlign: "left" }),
      alignCenter: editor.isActive({ textAlign: "center" }),
      alignRight: editor.isActive({ textAlign: "right" }),

      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  return (
    <div className="border border-input border-t-0 border-x-0 rounded-t-lg bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        {/* Formatting */}
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.bold}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={ACTIVE_TOGGLE}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Bold
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.italic}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={ACTIVE_TOGGLE}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Italic
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.strike}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={ACTIVE_TOGGLE}
              >
                <Strikethrough />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Strike
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.h1}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={ACTIVE_TOGGLE}
              >
                <Heading1 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Heading 1
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.h2}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={ACTIVE_TOGGLE}
              >
                <Heading2 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Heading 2
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.h3}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={ACTIVE_TOGGLE}
              >
                <Heading3 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Heading 3
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.bullet}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={ACTIVE_TOGGLE}
              >
                <List />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Bullet List
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.ordered}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={ACTIVE_TOGGLE}
              >
                <ListOrdered />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Ordered List
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Alignment */}
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.alignLeft}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={ACTIVE_TOGGLE}
              >
                <AlignLeft />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Align Left
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.alignCenter}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={ACTIVE_TOGGLE}
              >
                <AlignCenter />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Align Center
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.alignRight}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={ACTIVE_TOGGLE}
              >
                <AlignRight />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Align Right
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Undo/Redo */}
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!state.canRedo}
              >
                <Redo />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Redo
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!state.canUndo}
              >
                <Undo />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background">
              Undo
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
