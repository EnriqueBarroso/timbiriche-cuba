import { currentUser } from "@clerk/nextjs/server";
import { getFollowing } from "@/lib/api";
import FavoritesClient from "@/components/FavoritesClient";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await currentUser();

  let following: any[] = [];

  if (user) {
    following = await getFollowing(user.id).catch(() => []);
  }

  return <FavoritesClient following={following} />;
}
