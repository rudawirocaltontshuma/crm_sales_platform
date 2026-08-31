import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/dimension");
  return <>Coming Soon</>;
}
