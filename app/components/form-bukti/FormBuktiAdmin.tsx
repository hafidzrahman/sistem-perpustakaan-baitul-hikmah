"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

const FormBuktiAdmin = () => {
  const { data: session } = useSession();
  const [readingHistory, setReadingHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.username) {
        try {
          const response = await fetch(
            `/api/form-bukti/murid/${session.user.username}`
          );
          if (!response.ok) throw new Error("Failed to fetch data");
          const data = await response.json();
          setReadingHistory(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session?.user?.username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      Test {session?.user?.name}
    </div>
  );
};

export default FormBuktiAdmin;
