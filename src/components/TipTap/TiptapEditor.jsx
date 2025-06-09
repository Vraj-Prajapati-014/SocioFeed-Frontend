import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import 'prosemirror-view/style/prosemirror.css';
import { useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  StrikethroughS,
  FormatUnderlined,
  Undo,
  FormatListBulleted,
  FormatListNumbered,
} from '@mui/icons-material';

const TiptapEditor = ({ content, onUpdate, setEditor, isDark }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        paragraph: true,
        code: true,
        blockquote: true,
        history: true,
        dropcursor: true,
        gapcursor: true,
      }),
      Underline, // Add Underline extension
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-400 hover:underline',
        },
      }),
    ],
    content: content || '<p></p>', // Empty paragraph as initial content
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose custom-prose max-w-none p-3 sm:p-4 min-h-[120px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-gray-200'
            : 'bg-white border-gray-300 text-gray-800'
        }`,
      },
    },
  });

  useEffect(() => {
    if (editor && setEditor) {
      setEditor(editor);
    } else if (!editor) {
      console.error('Tiptap editor failed to initialize');
    }
  }, [editor, setEditor]);

  if (!editor) {
    console.warn('Editor is not ready');
    return <div className="text-red-500">Editor failed to load</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 sm:gap-2">
        <Tooltip title="Bold">
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${
              editor.isActive('bold')
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FormatBold fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${
              editor.isActive('italic')
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FormatItalic fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Strike">
          <IconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${
              editor.isActive('strike')
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <StrikethroughS fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${
              editor.isActive('underline')
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Undo">
          <IconButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className={`p-1 sm:p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
              isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Undo fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bullet List">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${
              editor.isActive('bulletList')
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FormatListBulleted fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ordered List">
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${
              editor.isActive('orderedList')
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FormatListNumbered fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;