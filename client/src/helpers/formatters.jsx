import { StockEntry, StockIO, StockExit } from "./declarations";

// utils/truncate.ts
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const IOMapper = (
  stockEntries,
  stockOutputs
) => {
  return [
    ...stockEntries.map((entry) => ({
      id: entree.id,
      productId: entry.product?.id,
      quantity: entree.quantity,
      date: entree.date,
      type: "ENTRY",
      supplier: entry.supplier?.name,
      product: entry.product?.name,
    })),
    ...stockOutputs.map((output) => ({
      id: sortie.id,
      productId: output.product?.id,
      quantity: sortie.quantity,
      date: sortie.date,
      type: "EXIT",
      intervenant: undefined, // No destination in your StockExit interface
      product: output.product?.name,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};
