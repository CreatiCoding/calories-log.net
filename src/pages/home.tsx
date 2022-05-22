import { Calendar } from "../components/calendar";

export default function HomePage() {
  const now = new Date();

  return (
    <>
      <h1>내 칼로리</h1>
      <Calendar year={now.getFullYear()} month={now.getMonth() + 1} />
    </>
  );
}
