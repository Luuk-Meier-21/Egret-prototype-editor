import { useRef, useState } from "react";
import Search from "../Search/Search";
import { useHotkeys } from "../../utils/hotkeys";

interface DocumentsOverviewProps {}

interface DocumentData {
  title: string;
  tags: string[];
}

// const TAG_OPTIONS = [
//   "Onderzoek",
//   "User Experience Design",
//   "User Interface Design",
//   "Concepting",
//   "Testen",
// ];

const DOCUMENTS_DATA: DocumentData[] = [
  {
    title: "Voorstel voor Gebruikersinterface Ontwerp",
    tags: ["User Interface Design", "Concepting"],
  },
  {
    title: "Analyse van Gebruikersbehoeften",
    tags: ["Onderzoek", "User Experience Design"],
  },
  {
    title: "Wireframes voor Mobiele Applicatie",
    tags: ["User Interface Design", "Concepting"],
  },
  {
    title: "Kleurpalet en Typografie Onderzoek",
    tags: ["Onderzoek", "User Interface Design"],
  },
  {
    title: "Interactieontwerp voor Webapplicatie",
    tags: ["User Interface Design", "Concepting"],
  },
  {
    title: "Gebruikerservaringsonderzoek",
    tags: ["Onderzoek", "User Experience Design"],
  },
  {
    title: "Prototyping en Testenplan",
    tags: ["Testen", "User Interface Design"],
  },
  {
    title: "Evaluatie van Bestaande Interfaces",
    tags: ["Testen", "User Interface Design"],
  },
  {
    title: "Visueel Ontwerp voor Website Redesign",
    tags: ["User Interface Design", "Concepting"],
  },
  {
    title: "Gebruikershandleiding voor Ontwerptools",
    tags: ["User Interface Design", "Concepting"],
  },
  {
    title: "Implementatie van Ontwerpelementen",
    tags: ["Implementatie", "User Interface Design"],
  },
  {
    title: "Toegankelijkheid en visuele beperking",
    tags: ["Testing", "User Interface Design"],
  },
  {
    title: "Gebruikerstesten en Feedbackverwerking",
    tags: ["Testing", "User Experience Design"],
  },
  {
    title: "Optimalisatie van Gebruikerservaring",
    tags: ["Optimalisatie", "User Experience Design"],
  },
  {
    title: "Ontwikkeling van Stijlgids",
    tags: ["Documentation", "User Interface Design"],
  },
  {
    title: "Gebruikersacceptatietesten",
    tags: ["Testing", "User Experience Design"],
  },
  {
    title: "Iteratieff Ontwerpproces",
    tags: ["Iteratief", "User Interface Design"],
  },
];

function DocumentsOverview({}: DocumentsOverviewProps) {
  const [filteredDocuments, setFilteredDocuments] = useState<
    DocumentData[] | null
  >(null);

  const resultsRef = useRef<HTMLUListElement>(null);

  useHotkeys("shift+cmd+backspace", (event) => {
    event.preventDefault();

    return false;
  });

  const focusFirstResult = () => {
    resultsRef.current?.querySelector("a")?.focus();
  };

  return (
    <div lang="nl">
      <Search
        list={DOCUMENTS_DATA}
        keys={["title", "tags"]}
        onResult={setFilteredDocuments}
        onConfirm={focusFirstResult}
      />
      <ul
        id="main-content"
        ref={resultsRef}
        aria-live="polite"
        className="flex flex-col"
      >
        {filteredDocuments?.length || 0 > 0 ? (
          (filteredDocuments || DOCUMENTS_DATA).map((document, i) => {
            return (
              <li key={i}>
                <a
                  href="/document"
                  aria-live="polite"
                  aria-label={`${document.title}, Tags: ${document.tags.join(", ")}`}
                  className="flex flex-col text-left ring-1 ring-red-300 focus:bg-red-300 focus:outline-none"
                >
                  <h2 className="font-bold">{document.title}</h2>
                  <ul className="flex gap-x-2">
                    {document.tags.map((tag, i) => (
                      <li key={i}>
                        <em>{tag}</em>
                      </li>
                    ))}
                  </ul>
                </a>
              </li>
            );
          })
        ) : (
          <div role="alert">Geen resultaten gevonden...</div>
        )}
      </ul>
    </div>
  );
}

export default DocumentsOverview;
