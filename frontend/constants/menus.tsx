import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import {
  LibraryBooksOutlined,
  LightbulbOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";

interface Menu {
  id: number;
  name: string;
  url: string;
  icon: ReactJSXElement;
}

export const menus: Array<Menu> = [
  {
    id: 1,
    name: "Knowledge Base",
    url: "",
    icon: <LibraryBooksOutlined fontSize="large" />,
  },
  {
    id: 2,
    name: "Tickets",
    url: "/tickets",
    icon: <SupportAgentOutlined fontSize="large" />,
  },
  {
    id: 3,
    name: "FAQ Insights",
    url: "",
    icon: <LightbulbOutlined fontSize="large" />,
  },
];

export const getMenuById = (id: number) => {
  return menus.find((m) => m.id === id);
};
