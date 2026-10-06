export interface Payment {
  id: string;
  customerName?: string;
  amount: number;
  customerAddress?: string;
  currency?: string;
  status: string;
  date: string;
  description?: string;
  clientId?: string;
}
