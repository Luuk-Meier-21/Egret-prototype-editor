import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DocumentRegionOverview, {
  DocumentRegion,
} from "./components/DocumentV2/DocumentV2";
import DocumentsOverview from "./components/DocumentsOverview/DocumentsOverview";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DocumentsOverview />,
    },
    {
      path: "/document",
      element: <DocumentRegionOverview />,
    },
    {
      path: "/document/region/1",
      element: (
        <DocumentRegionOverview
          renderRegion={({ titleTopLeft }) => (
            <DocumentRegion place="links boven" id="1" title={titleTopLeft} />
          )}
        />
      ),
    },
    {
      path: "/document/region/2",
      element: (
        <DocumentRegionOverview
          renderRegion={({ titleTopRight }) => (
            <DocumentRegion place="recht boven" id="2" title={titleTopRight} />
          )}
        />
      ),
    },
    {
      path: "/document/region/3",
      element: (
        <DocumentRegionOverview
          renderRegion={({ titleBottomLeft }) => (
            <DocumentRegion
              place="links onder"
              id="3"
              title={titleBottomLeft}
            />
          )}
        />
      ),
    },
    {
      path: "/document/region/4",
      element: (
        <DocumentRegionOverview
          renderRegion={({ titleBottomRight }) => (
            <DocumentRegion
              place="rechts onder"
              id="4"
              title={titleBottomRight}
            />
          )}
        />
      ),
    },
  ]);

  const start = async () => {
    await listen("ws-connect", (event) => {
      console.log(event);
      // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
      // event.payload is the payload object
    });
    const a = await listen("ws-upgrade", (event) => {
      console.log(event);
      // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
      // event.payload is the payload object
    });

    await invoke("start_companion_mode");
    console.log(a);
  };

  return (
    <div id="app">
      <button onClick={start}>Start</button>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
