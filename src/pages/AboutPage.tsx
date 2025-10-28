export default function AboutPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Про проект</h2>
      <p>Цей проект демонструє використання:</p>
      <ul>
        <li>React 18</li>
        <li>TypeScript</li>
        <li>TanStack Query для кешування серверного стану</li>
        <li>React Router для навігації</li>
        <li>JSONPlaceholder API для тестових даних</li>
      </ul>
    </div>
  );
}
