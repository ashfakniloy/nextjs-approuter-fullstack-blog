import { prisma } from "@/lib/prisma";
import { PER_PAGE } from "@/config";

export async function getPostsByUserId({
  userId,
  pageNumber,
  limitNumber,
  sort,
}: {
  userId: string;
  limitNumber: number;
  pageNumber?: number;
  sort?: string;
}) {
  const currentPage = Math.max(pageNumber || 1, 1);

  const count = await prisma.post.count({
    where: {
      userId: userId,
    },
  });

  const getDataBySort = async () => {
    if (!sort || sort === "recent") {
      const data = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },

        where: {
          userId: userId,
        },

        take: limitNumber || PER_PAGE,
        skip: (currentPage - 1) * (limitNumber || PER_PAGE) || 0,

        include: {
          user: {
            select: {
              username: true,
              id: true,
            },
          },
          _count: {
            select: {
              comments: true,
              views: true,
            },
          },
        },
      });

      return data;
    }

    if (sort === "popular") {
      const data = await prisma.post.findMany({
        orderBy: [
          {
            likes: {
              _count: "desc",
            },
          },
          {
            comments: {
              _count: "desc",
            },
          },
          {
            views: {
              _count: "desc",
            },
          },
        ],

        where: {
          userId: userId,
        },

        take: limitNumber || PER_PAGE,
        skip: (currentPage - 1) * (limitNumber || PER_PAGE) || 0,

        include: {
          user: {
            select: {
              username: true,
              id: true,
            },
          },
          _count: {
            select: {
              comments: true,
              views: true,
            },
          },
        },
      });

      return data;
    }
  };

  const data = await getDataBySort();

  return {
    data,
    count,
  };
}
