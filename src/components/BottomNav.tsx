import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Package, Boxes } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export default function BottomNav() {
  const [active, setActive] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current path

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      path: "/",
    },
    {
      id: "products",
      label: "Products",
      icon: <Boxes className="h-5 w-5" />,
      path: "/products",
    },
    {
      id: "category",
      label: "Categories",
      icon: <Package className="h-5 w-5" />,
      path: "/category",
    },
    {
      id: "order",
      label: "My Orders",
      icon: <Package className="h-5 w-5" />,
      path: "/orders",
    },
    {
      id: "user",
      label: "Customers",
      icon: <Users className="h-5 w-5" />,
      path: "/customers",
    },
  ];

  // Update active state whenever the path changes
  useEffect(() => {
    const activeItem = navItems.find((item) => item.path === location.pathname);
    if (activeItem) setActive(activeItem.id);
  }, [location.pathname]);

  const handleNavigation = (id: string, path: string) => {
    setActive(id); // Update active state when a button is clicked
    navigate(path); // Navigate to the selected path
  };

  return (
    <nav className="fixed bottom-0  left-0 right-0 border-t bg-orange-500">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id, item.path)}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <div
              className={`flex flex-col items-center gap-1 transition-colors ${
                active === item.id
                  ? "text-primary dark:text-white"
                  : "text-muted-foreground dark:text-gray-200"
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}
