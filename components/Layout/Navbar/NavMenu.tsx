// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ChevronDownIcon } from "@heroicons/react/24/outline";

// type NavLinksProps = (
//   | {
//       name: string;
//       link: string;
//       subLinks?: undefined;
//     }
//   | {
//       name: string;
//       subLinks: {
//         name: string;
//         link: string;
//       }[];
//       link?: undefined;
//     }
// )[];

// function NavMenu({ navLinks }: { navLinks: NavLinksProps }) {
//   const pathname = usePathname();
// const pathnameDecoded = pathname && decodeURIComponent(pathname);

//   const [showSubMenu, setShowSubMenu] = useState<string | null>(null);

//   const activeSubLinkClass = (
//     subLinks: { name: string; link: string }[] | undefined
//   ) => {
//     const value = subLinks?.find((subLink) => subLink.link === pathnameDecoded);

//     if (pathnameDecoded === value?.link) {
//       return "text-red-600 dark:text-red-400";
//     } else {
//       return "";
//     }
//   };

//   const menu = (navName: string | null) => {
//     if (showSubMenu === navName) {
//       return setShowSubMenu(null);
//     }
//     setShowSubMenu(navName);
//   };

//   return (
//     <div className="flex items-center gap-10">
//       {navLinks.map((navLink) => (
//         <div key={navLink.name} className="">
//           {navLink.link ? (
//             <Link href={navLink.link}>
//               <p
//                 className={` ${
//                   pathname === navLink.link && "text-red-600 dark:text-red-400"
//                 }`}
//               >
//                 {navLink.name}
//               </p>
//             </Link>
//           ) : (
//             <div
//               onMouseEnter={() => menu(navLink.name)}
//               onMouseLeave={() => menu(null)}
//               className={`relative ${activeSubLinkClass(navLink.subLinks)}`}
//             >
//               <p className={`cursor-pointer flex items-center gap-1`}>
//                 {navLink.name}
//                 <span className={` ${showSubMenu && "rotate-180"}`}>
//                   <ChevronDownIcon className="w-4 h-4" />
//                 </span>
//               </p>

//               {showSubMenu === navLink.name && (
//                 <div className="absolute -left-[80%] z-20 min-w-[250px]">
//                   <div className="">
//                     <div className="h-8"></div>
//                     <div className="py-3 text-sm text-gray-800 bg-gray-50 border rounded-md shadow-md font-montserrat dark:text-gray-300 dark:bg-stone-800">
//                       {navLink.subLinks?.map((subLink) => (
//                         <div
//                           key={subLink.name}
//                           className={`flex flex-col w-full transition duration-200 ${
//                             pathnameDecoded === subLink.link
//                               ? "bg-gray-300 dark:bg-stone-600 text-red-600 dark:text-red-400"
//                               : "hover:bg-gray-200 dark:hover:bg-stone-700"
//                           }`}
//                         >
//                           <Link href={subLink.link}>
//                             <p className={`py-2 pl-6 capitalize`}>
//                               {subLink.name}
//                             </p>
//                           </Link>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default NavMenu;

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type NavLinksProps = (
  | {
      name: string;
      link: string;
      subLinks?: undefined;
    }
  | {
      name: string;
      subLinks: {
        name: string;
        link: string;
      }[];
      link?: undefined;
    }
)[];

function NavMenu({ navLinks }: { navLinks: NavLinksProps }) {
  const pathname = usePathname();

  const pathnameDecoded = pathname && decodeURIComponent(pathname);

  const [showSubMenu, setShowSubMenu] = useState<string | null>(null);

  const activeSubLinkClass = (
    subLinks: { name: string; link: string }[] | undefined
  ) => {
    const value = subLinks?.find((subLink) => subLink.link === pathnameDecoded);

    if (pathnameDecoded === value?.link) {
      return "text-red-600 dark:text-red-400";
    } else {
      return "";
    }
  };

  const menu = (navName: string | null) => {
    if (showSubMenu === navName) {
      return setShowSubMenu(null);
    }
    setShowSubMenu(navName);
  };

  return (
    <nav className="flex items-center gap-10">
      {navLinks.map((navLink) => (
        <div key={navLink.name} className="">
          {navLink.link ? (
            <Link href={navLink.link}>
              <p
                className={` ${
                  pathname === navLink.link && "text-red-600 dark:text-red-400"
                }`}
              >
                {navLink.name}
              </p>
            </Link>
          ) : (
            <div
              onMouseEnter={() => menu(navLink.name)}
              onMouseLeave={() => menu(null)}
              className={`relative ${activeSubLinkClass(navLink.subLinks)}`}
            >
              <p className={`cursor-pointer flex items-center gap-1`}>
                {navLink.name}
                <span className={` ${showSubMenu && "rotate-180"}`}>
                  <ChevronDownIcon className="w-4 h-4" />
                </span>
              </p>

              <div
                className={`absolute -left-[80%] z-20 min-w-[250px] transition duration-200 ${
                  showSubMenu === navLink.name
                    ? "translate-y-0 opacity-100"
                    : "invisible -translate-y-3 opacity-0"
                }`}
              >
                <div className="">
                  <div className="h-8"></div>
                  <div className="p-1 text-sm text-gray-800 bg-white space-y-1 border rounded-md shadow-md font-montserrat dark:text-gray-300 dark:bg-stone-950">
                    {navLink.subLinks?.map((subLink) => (
                      <div
                        key={subLink.name}
                        className={`flex flex-col w-full transition duration-200 rounded-md ${
                          pathnameDecoded === subLink.link
                            ? "bg-gray-300 dark:bg-stone-600 text-red-600 dark:text-red-400"
                            : "hover:bg-gray-200 dark:hover:bg-stone-700"
                        }`}
                      >
                        <Link href={subLink.link}>
                          <p className={`py-2 pl-6 capitalize`}>
                            {subLink.name}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default NavMenu;
