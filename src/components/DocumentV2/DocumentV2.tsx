import { Fragment, ReactNode } from "react";
import { useHotkeys } from "../../utils/hotkeys";
import { usePersistentEditable } from "../../utils/persistent-state";

const NAVIGATION_KEYS = ["shift", "cmd"];

const navKeys = (...keys: string[]) => [...NAVIGATION_KEYS, ...keys].join("+");

interface DocumentRegionProps {
  title: string;
  place: string;
  id: string;
}

export function DocumentRegion({ title, place, id }: DocumentRegionProps) {
  const [titleRef, titleValue] = usePersistentEditable(`title-${id}`, title);
  const [contentRef, contentValue] = usePersistentEditable(
    `content-${id}`,
    "Geen content",
  );

  return (
    <section
      lang="nl"
      role="region"
      aria-label={`${title}, ${place}`}
      className="h-full w-full"
    >
      <ul role="menu">
        <li role="menuitem">
          <a href="/document" className="tab">
            Terug naar regio overzicht, "commando + shift + backspace"
          </a>
        </li>
      </ul>

      <h1 className="tab text-xl" ref={titleRef}>
        {titleValue}
      </h1>
      <article className="tab flex w-full flex-col" ref={contentRef}>
        {contentValue
          .split(/\r?\n/)
          // .filter((item) => item.length > 0)
          .map((content, i, arr) => (
            <Fragment key={i}>
              <p id={`content-${i}`} className="mb-2">
                {content}
                {i < arr.length - 1 ? "\n" : null}
              </p>
            </Fragment>
          ))}
      </article>
    </section>
  );
}

interface DocumentRegionOverviewProps {
  renderRegion?: (regions: {
    titleTopLeft: string;
    titleTopRight: string;
    titleBottomLeft: string;
    titleBottomRight: string;
  }) => ReactNode;
}

function DocumentRegionOverview({ renderRegion }: DocumentRegionOverviewProps) {
  const titleTopLeft = localStorage.getItem(`title-1`) || "Regio 1";
  const titleTopRight = localStorage.getItem(`title-2`) || "Regio 2";
  const titleBottomLeft = localStorage.getItem(`title-3`) || "Regio 3";
  const titleBottomRight = localStorage.getItem(`title-4`) || "Regio 4";

  useHotkeys(navKeys("backspace"), (event) => {
    event.preventDefault();
    console.log(window.location.href);
    if (window.location.href.includes("region")) {
      window.location.href = "/document";
    } else {
      window.location.href = "/ ";
    }

    return false;
  });

  useHotkeys(navKeys("j"), (event) => {
    event.preventDefault();
    window.location.href = "/document/region/1";
    return false;
  });

  useHotkeys(navKeys("k"), (event) => {
    event.preventDefault();
    window.location.href = "/document/region/2";
    return false;
  });

  useHotkeys(navKeys("n"), (event) => {
    event.preventDefault();
    window.location.href = "/document/region/3";
    return false;
  });

  useHotkeys(navKeys("m"), (event) => {
    event.preventDefault();
    window.location.href = "/document/region/4";
    return false;
  });

  return (
    <div
      data-testid="DocumentRegionOverview"
      data-component-name="DocumentRegionOverview"
    >
      <section className="relative min-h-screen">
        {renderRegion ? (
          renderRegion({
            titleTopLeft,
            titleTopRight,
            titleBottomLeft,
            titleBottomRight,
          })
        ) : (
          <div role="region">
            <ul role="menu">
              <li role="menuitem">
                <a href="/" className="tab">
                  Terug naar documenten overzicht, "commando + shift +
                  backspace"
                </a>
              </li>
            </ul>
            <ul
              role="menu"
              className="grid min-h-screen grid-cols-2 grid-rows-2"
            >
              <li role="menuitem">
                <a
                  href="/document/region/1"
                  className="tab flex h-full w-full ring-2 ring-red-500"
                >
                  {titleTopLeft}, Links boven
                </a>
              </li>
              <li role="menuitem">
                <a
                  href="/document/region/2"
                  className="tab flex h-full w-full ring-2 ring-red-500"
                >
                  {titleTopRight}, Rechts boven
                </a>
              </li>
              <li role="menuitem">
                <a
                  href="/document/region/3"
                  className="tab flex h-full w-full ring-2 ring-red-500"
                >
                  {titleBottomLeft}, Links onder
                </a>
              </li>
              <li role="menuitem">
                <a
                  href="/document/region/4"
                  className="tab flex h-full w-full ring-2 ring-red-500"
                >
                  {titleBottomRight}, Rechts onder
                </a>
              </li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default DocumentRegionOverview;
