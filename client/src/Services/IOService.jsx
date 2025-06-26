import axios from "axios";
import { IOMapper } from "../helpers/formatters";
const apiBase = "http://localhost:8080";

export const GetAllIOStock = async () => {
  try {
    const entries = await axios.get(
      `${apiBase}/Api/StockEntry/GetAllStockEntries`
    );
    const outputs = await axios.get(
      `${apiBase}/Api/StockOutput/GetAllStockOutputs`
    );
    const results = IOMapper(entries.data, outputs.data);
    return results;
  } catch (error) {
    console.error("Error in GetAllSuppliers:", error);
    return [];
  }
};

export const CreateStockEntry = async (addStockEntryDto) => {
  try {
    const response = await axios.post(
      `${apiBase}/Api/StockEntry/CreateStockEntry`,
      addStockEntryDto
    );
    return response.data;
  } catch (error) {
    console.error("Error in CreateStockEntry:", error);
    return null;
  }
};

export const CreateStockOutput = async (addStockOutputDto) => {
  try {
    const response = await axios.post(
      `${apiBase}/Api/StockOutput/CreateStockOutput`,
      addStockOutputDto
    );
    return response.data;
  } catch (error) {
    console.error("Error in CreateStockOutput:", error);
    return null;
  }
};
