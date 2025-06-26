import axios from "axios";

const apiBase = "http://localhost:8080";

export const GetAllMessages = async () => {
  try {
    const reponse = await axios.get(
      `${apiBase}/Api/Message/GetAllMessages`
    );
    return reponse.data;
  } catch (error) {
    console.error("Error in GetAllMessages:", error);
    return [];
  }
};

export const MarkAsRead = async (id) => {
  try {
    const reponse = await axios.put(
      `${apiBase}/Api/Message/MarkAsRead/${id}`
    );
    return reponse.data;
  } catch (error) {
    console.error("Error in MarkAsRead:", error);
    return null;
  }
};
