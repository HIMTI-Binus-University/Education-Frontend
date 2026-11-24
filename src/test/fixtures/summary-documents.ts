import type { JSONContent } from "@tiptap/react";

const text = (value: string): JSONContent => ({ type: "text", text: value });
const paragraph = (...values: (string | JSONContent)[]): JSONContent => ({
  type: "paragraph",
  content: values.map((value) =>
    typeof value === "string" ? text(value) : value,
  ),
});
const heading = (value: string): JSONContent => ({
  type: "heading",
  attrs: { level: 2 },
  content: [text(value)],
});
const bold = (value: string): JSONContent => ({
  ...text(value),
  marks: [{ type: "bold" }],
});
const math = (latex: string): JSONContent => ({
  type: "inlineMath",
  attrs: { latex },
});
const formula = (latex: string): JSONContent => ({
  type: "blockMath",
  attrs: { latex },
});
const quote = (value: string): JSONContent => ({
  type: "blockquote",
  content: [paragraph(value)],
});
const list = (
  type: "bulletList" | "orderedList",
  values: (string | JSONContent)[],
): JSONContent => ({
  type,
  content: values.map((value) => ({
    type: "listItem",
    content: [typeof value === "string" ? paragraph(value) : value],
  })),
});
const code = (language: string, value: string): JSONContent => ({
  type: "codeBlock",
  attrs: { language },
  content: [text(value)],
});

export const summaryDocuments: Record<string, JSONContent> = {
  "dynamic-programming": {
    type: "doc",
    content: [
      heading("Start with the problem"),
      paragraph(
        "Dynamic programming solves a problem by storing the answers to smaller, overlapping subproblems. Instead of repeating the same calculation, we reuse a result we already know.",
      ),
      quote(
        "This is demonstration material for the Education Site preview, not an official HIMTI exam summary.",
      ),
      heading("Recognise the pattern"),
      paragraph("Two properties make a problem a good candidate:"),
      list("bulletList", [
        paragraph(
          bold("Overlapping subproblems: "),
          "smaller calculations appear more than once.",
        ),
        paragraph(
          bold("Optimal substructure: "),
          "a solution can be built from solutions to smaller problems.",
        ),
      ]),
      heading("A Fibonacci example"),
      paragraph(
        "The recurrence is ",
        math("F_n = F_{n-1} + F_{n-2}"),
        ", with ",
        math("F_0 = 0"),
        " and ",
        math("F_1 = 1"),
        ".",
      ),
      code(
        "cpp",
        `int fibonacci(int n) {
    if (n <= 1) return n;
    int previous = 0, current = 1;
    for (int i = 2; i <= n; ++i) {
        int next = previous + current;
        previous = current;
        current = next;
    }
    return current;
}`,
      ),
      paragraph(
        "This bottom-up implementation takes ",
        math("O(n)"),
        " time and ",
        math("O(1)"),
        " additional space. A fixed-width integer can overflow for large inputs; this example is for small nonnegative values.",
      ),
      heading("Choosing an approach"),
      {
        type: "table",
        content: [
          ["Approach", "How it works", "Useful when"],
          [
            "Memoisation",
            "Cache recursive results",
            "Only some states are visited",
          ],
          [
            "Tabulation",
            "Fill states from the bottom up",
            "State order is straightforward",
          ],
        ].map((row, index) => ({
          type: "tableRow",
          content: row.map((value) => ({
            type: index === 0 ? "tableHeader" : "tableCell",
            content: [paragraph(value)],
          })),
        })),
      },
      heading("Before the exam"),
      list("orderedList", [
        "Define what each state represents.",
        "Identify the base cases.",
        "Write the transition between states.",
        "Check the order of evaluation.",
        "Analyse time and memory complexity.",
      ]),
      paragraph(
        "For language reference, see the ",
        {
          ...text("C++ reference"),
          marks: [
            { type: "link", attrs: { href: "https://en.cppreference.com/w/" } },
          ],
        },
        ".",
      ),
    ],
  },
  "database-normalization": {
    type: "doc",
    content: [
      heading("Why normalise?"),
      paragraph(
        "Normalisation organises relational data to reduce redundancy and avoid update, insertion, and deletion anomalies.",
      ),
      quote(
        "Demonstration material only. Official academic content will be supplied through the publishing workflow.",
      ),
      heading("Normal forms"),
      list("bulletList", [
        paragraph(
          bold("1NF: "),
          "each attribute contains atomic values for the chosen domain.",
        ),
        paragraph(
          bold("2NF: "),
          "in 1NF, with no non-prime attribute partially dependent on a candidate key.",
        ),
        paragraph(
          bold("3NF: "),
          "for each non-trivial dependency, the determinant is a superkey or the dependent attribute is prime.",
        ),
      ]),
      heading("Splitting a relation"),
      paragraph(
        "If each course has one name, store that name in a course relation instead of repeating it on every enrolment.",
      ),
      code(
        "sql",
        "SELECT course.id, course.name\nFROM course\nORDER BY course.name;",
      ),
      heading("Check your decomposition"),
      list("orderedList", [
        "List the functional dependencies.",
        "Identify candidate keys.",
        "Check the target normal form.",
        "Verify a lossless decomposition and dependency preservation.",
      ]),
    ],
  },
  "architecture-basics": {
    type: "doc",
    content: [
      heading("The instruction cycle"),
      paragraph(
        "A processor fetches an instruction, decodes it, and executes the operation. Registers hold small amounts of data close to the execution units.",
      ),
      quote("Demonstration content, not an official exam resource."),
      heading("Memory hierarchy"),
      list("bulletList", [
        "Registers offer very fast access with limited capacity.",
        "Caches keep frequently used data near the processor.",
        "Main memory stores active programs and data.",
      ]),
      heading("Measuring execution time"),
      formula("T_{CPU} = N_{instructions} \\times CPI \\times T_{clock}"),
      paragraph(
        "Use consistent units when relating instruction count, cycles per instruction, and clock period.",
      ),
      heading("Review checklist"),
      list("orderedList", [
        "Explain fetch, decode, and execute.",
        "Distinguish cache from main memory.",
        "Calculate execution time from a clock period.",
      ]),
    ],
  },
  derivatives: {
    type: "doc",
    content: [
      heading("Understanding a derivative"),
      paragraph(
        "A derivative describes the instantaneous rate of change of a function.",
      ),
      quote("Demonstration content for testing mathematical typesetting."),
      heading("The limit definition"),
      formula("f'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}"),
      heading("Common rules"),
      list("bulletList", [
        paragraph("Power rule: ", math("\\frac{d}{dx}x^n = nx^{n-1}"), "."),
        "Sum rule: differentiate each term separately.",
        "Chain rule: differentiate the outside function, then multiply by the derivative of the inside.",
      ]),
      heading("Practice method"),
      paragraph(
        "Identify the structure of the function before choosing a differentiation rule. Check the domain before simplifying.",
      ),
    ],
  },
};
