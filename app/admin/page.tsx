import { AdminApp } from "@/components/admin/AdminApp";

/**
 * Limited backend admin panel.
 * Protected by ADMIN_PASSWORD + session cookie (simple site-owner gate).
 * Edits content/integrations.json and content/kb.json.
 */
export default function AdminPage() {
  return <AdminApp />;
}
