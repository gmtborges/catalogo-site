import { createFileRoute } from "@tanstack/react-router";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

const pb = new PocketBase("http://127.0.0.1:8090");

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [store, setStore] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeCollection = await pb
          .collection("stores")
          .getFirstListItem(`user=${pb.authStore?.record?.id}`);

        console.log({ storeCollection });
      } catch (err) {
        setStore(null);
      }
    };

    fetchData();
  }, []);
  return <div className="text-center">Catalogo {store}</div>;
}
