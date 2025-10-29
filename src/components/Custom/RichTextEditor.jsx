"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const RichTextEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        immediatelyRender: false, // SSR safe
    });

    if (!editor) return null;

    const buttonClass = (isActive) =>
        `px-3 py-1 rounded-md border transition-colors duration-150 ${isActive ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
        }`;

    return (
        <div className="border border-gray-200 rounded-2xl shadow-sm p-4 bg-white">
            {/* Toolbar */}
            <div className="flex gap-2 mb-3 flex-wrap">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={buttonClass(editor.isActive("bold"))}
                >
                    B
                </button>
                <button 
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={buttonClass(editor.isActive("italic"))}
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={buttonClass(editor.isActive("underline"))}
                >
                    U
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={buttonClass(editor.isActive("bulletList"))}
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={buttonClass(editor.isActive("orderedList"))}
                >
                    1. List
                </button>
            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="min-h-[180px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
        </div>
    );
};

export default RichTextEditor;



// "use client";

// import React, { useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import { TextStyle } from "@tiptap/extension-text-style";
// import Color from "@tiptap/extension-color";

// const RichTextEditor = ({ value, onChange }) => {
//     const [content, setContent] = useState(value || "");

//     const editor = useEditor({
//         extensions: [StarterKit, TextStyle.configure({
//             types: ['textStyle', 'paragraph', 'heading'], // fontSize ke liye
//         }), Color],
//         content,
//         onUpdate: ({ editor }) => {
//             const html = editor.getHTML();
//             setContent(html);
//             onChange(html);
//         },
//         editorProps: {
//             attributes: {
//                 class: "prose max-w-full focus:outline-none",
//             },
//         },
//         immediatelyRender: false,
//     });

//     if (!editor) return null;

//     const buttonClass = (isActive) =>
//         `px-3 py-1 rounded-md border transition-colors duration-150 font-medium ${isActive ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
//         }`;

//     const applyFontSize = (size) => editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
//     const applyColor = (color) => editor.chain().focus().setMark("textStyle", { color }).run();

//     return (
//         <div className="border border-gray-200 rounded-2xl shadow-sm p-4 bg-white">
//             <div className="flex flex-wrap gap-2 mb-3 items-center">
//                 <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive("bold"))}>B</button>
//                 <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive("italic"))}>I</button>
//                 <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClass(editor.isActive("underline"))}>U</button>

//                 <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive("bulletList"))}>• List</button>
//                 <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive("orderedList"))}>1. List</button>

//                 <select onChange={(e) => applyFontSize(e.target.value)} className="border rounded-md px-2 py-1 text-sm" defaultValue="">
//                     <option value="">Font Size</option>
//                     <option value="12px">12</option>
//                     <option value="14px">14</option>
//                     <option value="16px">16</option>
//                     <option value="18px">18</option>
//                     <option value="20px">20</option>
//                     <option value="24px">24</option>
//                 </select>

//                 <input type="color" onChange={(e) => applyColor(e.target.value)} className="w-8 h-8 p-0 border-none cursor-pointer" title="Text Color" />
//             </div>

//             <EditorContent editor={editor} className="min-h-[200px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
//         </div>
//     );
// };

// export default RichTextEditor;
