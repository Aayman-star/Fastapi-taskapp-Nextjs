import Image from "next/image";
import Link from "next/link";
import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <div className="w-full min-h-screen grid place-content-center gap-10">
      <TodoApp />
    </div>
  );
}
