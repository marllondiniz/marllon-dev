export type EnxovalCategory = {
  id: string;
  name: string;
  sort_order: number;
  icon: string | null;
  created_at: string;
  updated_at: string;
};

export type EnxovalItem = {
  id: string;
  category_id: string;
  name: string;
  quantity_total: number;
  quantity_reserved: number;
  link: string | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: EnxovalCategory;
};

export type EnxovalItemWithStatus = EnxovalItem & {
  disponivel: number;
  status: "disponivel" | "parcialmente_reservado" | "esgotado";
};

export type EnxovalReservation = {
  id: string;
  item_id: string;
  name: string;
  phone: string;
  quantity: number;
  message: string | null;
  status: "active" | "cancelled" | "delivered";
  created_at: string;
  updated_at: string;
  item?: EnxovalItem;
};
