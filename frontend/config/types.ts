
interface UserStats {
  total: number;
  male: number;
  female: number;
  prefer_not_say: number;
}

interface AgentsStats {
  total: number;
  approved: number;
  not_approved: number;
  agrovets: number;
  freelancers: number;
}

interface ContactFormEntriesStats {
  total: number;
  read: number;
  unread: number;
}

export interface Stats {
  users: UserStats;
  merchants: number;
  products: AgentsStats;
  orders: number;
  reviews: number;
  counties: number;
  subscribers: number;
  categories: number;
  blogs: number;
  contact_form_entries: ContactFormEntriesStats;
}

export interface ICategory {
  id: number
  name: string
  description: string
  slug: string
  parent: number | null
}


export interface IEcommerceStats {
  total_products: number
  total_categories: number
  total_orders: number
  total_carts: number
  total_discounts: number
  orders_by_status: {
    pending: number
    paid: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
  },
  transactions: {
    pending_transactions: number
    completed_transactions: number
    failed_transactions: number
  }
}

export interface IProductImage {
  id: number
  image: string
}

export interface IProduct {
  id: number
  name: string
  description: string
  price: number
  sale_price: number | null
  category_id: number | string
  stock: number
  sku: string
  is_active: boolean
  weight: number | null
  dimensions: string
  fragrance_notes: string
  burn_time: string
  materials: string
  images?: IProductImage[]
  _images: File[]
  category: string
}