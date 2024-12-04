// pages/api/reservation/[id].ts

import { NextApiRequest, NextApiResponse } from "next";

// Handle the PUT request to update reservation
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query; // Get the reservation ID from the URL

  if (req.method === "PUT") {
    try {
      // You can update the reservation in the database here
      const updatedReservation = {
        id,
        ...req.body, // assuming the body has the updated reservation details
      };
      res.status(200).json(updatedReservation); // Send the updated reservation as JSON
    } catch (error) {
      res.status(500).json({ message: "Error updating reservation" });
    }
  } else {
    // Handle unsupported methods
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
