import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollText, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

const featuredStores = [
  {
    id: 1,
    name: "Loja do João",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    slug: "loja-do-joao",
  },
  {
    id: 2,
    name: "Maria Flores",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    slug: "maria-flores",
  },
  {
    id: 3,
    name: "Tech Store",
    image:
      "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop",
    slug: "tech-store",
  },
  {
    id: 4,
    name: "Café Central",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    slug: "cafe-central",
  },
];

function App() {
  const [query, setQuery] = useState("");
  return (
    <>
      <header className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <ScrollText className="text-primary mr-2 h-5 w-5" />
            <Link
              to="/"
              className="font-bold text-xl hover:cursor-pointer transition-colors hover:text-primary"
            >
              catalogo.site
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/entrar">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/cadastrar">Criar loja</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl text-center" id="hero">
        <h1 className="mb-6 text-5xl font-bold">
          <span className="inline bg-gradient-to-r from-teal-300 to-teal-600 bg-clip-text text-transparent">
            Vem ser digital!
          </span>
        </h1>
        <h2 className="mb-8 text-xl text-muted-foreground">
          Conecte a sua empresa com seus clientes.
        </h2>
        <div className="relative w-4/5 mx-auto">
          <Input
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            type="text"
            placeholder="Buscar produtos ou serviços..."
            className="text-lg h-12 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <section className="mx-auto max-w-5xl mt-16 px-4">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-2">Lojas em Destaque</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStores.map((store) => (
            <div
              key={store.id}
              className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-3 truncate">
                  {store.name}
                </h4>
                <Button variant="outline" asChild className="w-full">
                  <a href={store.slug}>Ir a loja</a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
