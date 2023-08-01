// import { prisma } from "@/lib/prisma";
// import { PER_PAGE } from "@/config";

// export async function getAllPostsAdmin({
//   limitNumber,
//   pageNumber,
//   sortBy,
//   order,
//   title,
//   categoryName,
//   username,
// }: {
//   limitNumber: number;
//   pageNumber?: number;
//   sortBy?: string;
//   order?: string;
//   title?: string;
//   categoryName?: string;
//   username?: string;
// }) {
//   const currentPage = Math.max(pageNumber || 1, 1);

//   const count = await prisma.post.count({
//     where: {
//       title: {
//         startsWith: title,
//         mode: "insensitive",
//       },
//     },
//   });

//   const sortCase = () => {
//     switch (sortBy) {
//       case "title":
//         return {
//           title: order,
//         };

//       case "category":
//         return {
//           categoryName: order,
//         };

//       case "created at":
//         return {
//           createdAt: order,
//         };

//       case "username":
//         return {
//           user: {
//             username: order,
//           },
//         };

//       case "comments":
//         return {
//           comments: {
//             _count: order,
//           },
//         };

//       case "views":
//         return {
//           views: {
//             _count: order,
//           },
//         };

//       default:
//         // return {
//         //   createdAt: order,
//         // };
//         break;
//     }
//   };

//   // const sorting = {
//   //   [`${sortBy}`]: order,
//   // };

//   const sorting = sortCase() as any;

//   const data = await prisma.post.findMany({
//     orderBy: sorting || {
//       createdAt: "desc",
//     },

//     where: {
//       title: {
//         startsWith: title,
//         mode: "insensitive",
//       },
//       categoryName: {
//         startsWith: categoryName,
//         mode: "insensitive",
//       },
//       user: {
//         username: {
//           startsWith: username,
//           mode: "insensitive",
//         },
//       },
//     },

//     take: limitNumber,
//     skip: (currentPage - 1) * limitNumber || 0,

//     include: {
//       user: {
//         select: {
//           username: true,
//           id: true,
//         },
//       },
//       _count: {
//         select: {
//           comments: true,
//           views: true,
//           likes: true,
//         },
//       },
//     },
//   });

//   return {
//     data,
//     count,
//   };
// }

import { prisma } from "@/lib/prisma";
import { PER_PAGE } from "@/config";
import { Prisma } from "@prisma/client";

export async function getAllPostsAdmin({
  limitNumber,
  pageNumber,
  sortBy,
  order,
  title,
  categoryName,
  username,
}: {
  limitNumber: number;
  pageNumber?: number;
  sortBy?: string;
  order?: string;
  title?: string;
  categoryName?: string;
  username?: string;
}) {
  const currentPage = Math.max(pageNumber || 1, 1);

  const count = await prisma.post.count({
    where: {
      title: {
        startsWith: title,
        mode: "insensitive",
      },
    },
  });

  const sortCase = () => {
    switch (sortBy) {
      case "title":
        return {
          title: order,
        };

      case "category":
        return {
          categoryName: order,
        };

      case "created at":
        return {
          createdAt: order,
        };

      case "username":
        return {
          user: {
            username: order,
          },
        };

      case "comments":
        return {
          comments: {
            _count: order,
          },
        };

      case "views":
        return {
          views: {
            _count: order,
          },
        };

      default:
        // return {
        //   createdAt: order,
        // };
        break;
    }
  };

  // const sorting = {
  //   [`${sortBy}`]: order,
  // };

  const sorting = sortCase() as any;

  const data = await prisma.post.findMany({
    orderBy: sorting || {
      createdAt: "desc",
    },

    where: {
      title: {
        startsWith: title,
        mode: "insensitive",
      },
      categoryName: {
        equals: categoryName,
        mode: "insensitive",
      },
      user: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    },

    take: limitNumber,
    skip: (currentPage - 1) * limitNumber || 0,

    select: {
      id: true,
      title: true,
      categoryName: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          username: true,
          id: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          commentsReplies: true,
          views: true,
        },
      },
    },

    // include: {
    //   user: {
    //     select: {
    // username: true,
    // id: true,
    //     },
    //   },
    //   _count: {
    //     select: {
    //       comments: true,
    //       views: true,
    //       likes: true,
    //     },
    //   },
    // },
  });

  return {
    data,
    count,
  };
}

export type PostAdminTypes = Prisma.PromiseReturnType<
  typeof getAllPostsAdmin
>["data"][number];
