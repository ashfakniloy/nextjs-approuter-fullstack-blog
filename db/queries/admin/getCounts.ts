import { prisma } from "@/lib/prisma";

export async function getCounts() {
  try {
    // const usersCount = await prisma.user.count();
    // const postsCount = await prisma.post.count();
    // const viewsCount = await prisma.view.count();
    // const categoriesCount = await prisma.category.count();

    // return {
    //   usersCount,
    //   postsCount,
    //   viewsCount,
    //   categoriesCount,
    // };

    const [usersCount, postsCount, viewsCount, categoriesCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.post.count(),
        prisma.view.count(),
        prisma.category.count(),
      ]);

    return {
      usersCount,
      postsCount,
      viewsCount,
      categoriesCount,
    };
  } catch (error) {
    console.log("fetch error:", error);
    throw new Error("Failed to fetch");
  }
}
