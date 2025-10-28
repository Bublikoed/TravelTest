import { useQuery } from "@tanstack/react-query";

// Тип для користувача
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

// Функція для отримання користувачів з API
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) {
    throw new Error("Помилка при завантаженні користувачів");
  }
  return response.json();
};

function UserList() {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Завантаження користувачів...</h3>
        <div style={{ marginTop: "10px" }}>⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <h3>Помилка при завантаженні</h3>
        <p>{(error as Error).message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Спробувати знову
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Список користувачів</h2>
        <button
          type="button"
          onClick={() => refetch()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Оновити
        </button>
      </div>

      <div style={{ display: "grid", gap: "15px" }}>
        {users?.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{user.name}</h3>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>Телефон:</strong> {user.phone}
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>Веб-сайт:</strong>{" "}
              <a
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff" }}
              >
                {user.website}
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
