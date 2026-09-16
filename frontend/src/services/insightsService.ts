const CONSUMPTION_API_URL =
  "http://localhost:3001/api/consumptions/monthly";

const LOSS_API_URL =
  "http://localhost:3001/api/losses/monthly";

export const getMonthlyConsumption = async (
  year: number,
  month: number
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${CONSUMPTION_API_URL}?year=${year}&month=${month}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de charger la consommation"
    );
  }

  return data;
};

export const getMonthlyLoss = async (
  year: number,
  month: number
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${LOSS_API_URL}?year=${year}&month=${month}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de charger les pertes"
    );
  }

  return data;
};