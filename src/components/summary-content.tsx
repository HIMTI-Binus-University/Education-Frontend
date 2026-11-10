import { useEffect, useMemo } from "react";
import {
  EditorContent,
  Extension,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table, TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Mathematics } from "@tiptap/extension-mathematics";
import { createLowlight } from "lowlight";
import cpp from "highlight.js/lib/languages/cpp";
import sql from "highlight.js/lib/languages/sql";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import { safeExternalUrl, type Summary } from "../data/demo";

const lowlight = createLowlight({ cpp, sql, javascript, python });
const ReaderAnchors = Extension.create({
  name: "readerAnchors",
  addGlobalAttributes() {
    return [
      {
        types: ["heading"],
        attributes: {
          id: { default: null, renderHTML: ({ id }) => (id ? { id } : {}) },
        },
      },
    ];
  },
});
const ReaderTable = Table.extend({
  addNodeView() {
    return null;
  },
  renderHTML(props) {
    return [
      "div",
      {
        class: "tableWrapper table-scroll",
        role: "region",
        "aria-label": "Summary table",
        tabindex: "0",
      },
      this.parent!({
        ...props,
        HTMLAttributes: {
          ...props.HTMLAttributes,
          style: "min-width: 560px; width: 100%",
        },
      }),
    ];
  },
});
const ReaderCode = CodeBlockLowlight.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      "pre",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        "code",
        {
          class: `hljs${node.attrs.language ? ` language-${node.attrs.language}` : ""}`,
        },
        0,
      ],
    ];
  },
});
const ReaderImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        renderHTML: ({ src }) => {
          const safe = safeExternalUrl(
            typeof src === "string" ? src : undefined,
          );
          return safe ? { src: safe } : {};
        },
      },
    };
  },
});

const extensions = [
  StarterKit.configure({
    codeBlock: false,
    undoRedo: false,
    dropcursor: false,
    gapcursor: false,
    trailingNode: false,
    heading: { levels: [2, 3] },
    link: {
      openOnClick: true,
      autolink: false,
      linkOnPaste: false,
      isAllowedUri: (url) => Boolean(safeExternalUrl(url)),
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer",
        title: "Opens in a new tab",
      },
    },
  }),
  ReaderAnchors,
  TableKit.configure({ table: false }),
  ReaderTable.configure({ resizable: false, renderWrapper: false }),
  ReaderImage.configure({
    allowBase64: false,
    HTMLAttributes: { loading: "lazy", referrerpolicy: "no-referrer" },
  }),
  ReaderCode.configure({ lowlight, defaultLanguage: "plaintext" }),
  Mathematics.configure({
    katexOptions: { trust: false, throwOnError: false, strict: "ignore" },
  }),
];

export default function SummaryContent({ summary }: { summary: Summary }) {
  const content = useMemo(() => {
    let index = 0;
    return {
      ...summary.content,
      content: summary.content.content?.map((node) =>
        node.type === "heading" && node.attrs?.level === 2
          ? { ...node, attrs: { ...node.attrs, id: `section-${index++}` } }
          : node,
      ),
    };
  }, [summary.content]);
  const editor = useEditor(
    {
      extensions,
      content,
      editable: false,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "tiptap-reader",
          role: "document",
          "aria-label": `${summary.title} summary`,
          tabindex: "0",
        },
      },
    },
    [summary.id, summary.title, content],
  );

  useEffect(() => {
    document.title = `${summary.title} | HIMTI Education`;
    return () => {
      document.title = "HIMTI Education";
    };
  }, [summary.title]);

  return editor ? (
    <EditorContent editor={editor} />
  ) : (
    <p role="status">Preparing summary…</p>
  );
}
