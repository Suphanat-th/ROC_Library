import { useState, useEffect } from "react";
import { PatchItemsDto } from "@/types/patch";

export function useItemDb() {
  const [items, setItems] = useState<Record<string, PatchItemsDto>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/assets/json/PatchItemDB.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load JSON");
        return res.json();
      })
      .then((data: Record<string, PatchItemsDto>) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("เกิดข้อผิดพลาด:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { items, loading, error };
}
