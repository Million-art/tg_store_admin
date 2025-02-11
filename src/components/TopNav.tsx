import { useEffect, useState } from "react";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function TopNav() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [currentTheme]);

  return (
    <nav className="mb-5 top-0 left-0 right-0 bg-orange-500 shadow-md px-4 py-3 z-10">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <h1 className="text-lg font-semibold text-white">Welcome</h1>

        <div className="flex items-center gap-4">
          <Button variant="ghost">
            <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-white" />
          </Button>

          {/* Dark Mode Toggle Button */}
          <Button
            variant="ghost"
            onClick={() => {
              const newTheme = currentTheme === "dark" ? "light" : "dark";
              setTheme(newTheme); // Toggle theme
              localStorage.setItem("theme", newTheme); // Store the theme in localStorage for persistence
            }}
          >
            {mounted && currentTheme === "dark" ? (
              <Sun className="h-6 w-6 text-white" />
            ) : (
              <Moon className="h-6 w-6 text-gray-600" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
