// export { default } from "next-auth/middleware";

// export const config = {
//   matcher: ["/add-post/:path*", "/edit-post", "/my-profile/:path*"],
// };

// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export default async function middleware(req: NextRequest) {
//   const { origin, pathname } = req.nextUrl;

//   const secret = process.env.NEXTAUTH_SECRET;

//   const token = await getToken({ req, secret });
//   console.log("token from middleware", token?.user?.role);

//   //for admin
//   if (pathname !== "/admin/signin") {
//     if (pathname.includes("/admin")) {
//       if (token?.user?.role !== "ADMIN") {
//         return NextResponse.redirect(`${origin}/admin/signin`);
//       }
//     }
//   } else {
//     if (token?.user?.role === "ADMIN") {
//       return NextResponse.redirect(`${origin}/admin`);
//     }
//   }

//   // for user
//   if (pathname !== "/signin" && pathname !== "/signup") {
//     if (token?.user?.role !== "USER") {
//       return NextResponse.redirect(`${origin}/signin`);
//     }
//   } else {
//     if (token?.user?.role === "USER") {
//       return NextResponse.redirect(`${origin}`);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/add-post/:path*",
//     "/edit-post",
//     "/my-profile/:path*",
//     "/signin",
//     "/signup",
//     "/admin/:path*",
//   ],
// };

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { Session } from "next-auth";

export default async function middleware(req: NextRequest) {
  const { origin, pathname } = req.nextUrl;

  const secret = process.env.NEXTAUTH_SECRET;

  const token = (await getToken({ req, secret })) as Session | null;
  // console.log("token from middleware", token);

  if (pathname.includes("/admin")) {
    //for admin
    if (pathname !== "/admin/signin") {
      if (token?.user.role !== "ADMIN") {
        return NextResponse.redirect(`${origin}/admin/signin`);
      }
    } else {
      if (token?.user.role === "ADMIN") {
        return NextResponse.redirect(`${origin}/admin`);
      }
    }
  } else {
    // for user
    if (pathname !== "/signin" && pathname !== "/signup") {
      if (token?.user.role !== "USER") {
        return NextResponse.redirect(`${origin}/signin`);
      }
    } else {
      if (token?.user.role === "USER") {
        return NextResponse.redirect(`${origin}`);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-post/:path*",
    "/edit-post",
    "/my-profile/:path*",
    "/signin",
    "/signup",
    "/admin/:path*",
  ],
};
