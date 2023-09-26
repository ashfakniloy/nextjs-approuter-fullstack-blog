"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { revalidateAll } from "@/actions/revalidateAll";

function ViewCount({ postId, isAdmin }: { postId: string; isAdmin: boolean }) {
  useEffect(() => {
    if (isAdmin) return;

    const deviceId = Cookies.get("deviceId");

    // if (!deviceId) {
    //   const newDeviceId = uuidv4();
    //   Cookies.set("deviceId", newDeviceId);
    // }

    const countView = async () => {
      const url = `/api/post/view?postId=${postId}&deviceId=${deviceId}`;
      const response = await fetch(url, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        if (data.viewAdded) {
          revalidateAll();
        }

        // router.refresh();
        // console.log("viewed success", data);
        // await fetch(`/api/revalidate?path=/admin`);
      } else {
        console.log("view error", data);
      }
    };

    deviceId && countView();
  }, []);

  // useEffect(() => {
  //   const countView = async () => {
  //     const url = `/api/post/view?postId=${postId}`;
  //     const response = await fetch(url, {
  //       method: "POST",
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       console.log("viewed success", data);
  //       const setViewID = localStorage.setItem("viewID", postId);
  //       router.refresh();
  //     } else {
  //       console.log("viewed error", data);
  //     }
  //   };

  //   const getViewID = localStorage.getItem("viewID");

  //   getViewID !== postId && countView();
  // }, [postId]);
  return <></>;
}

export default ViewCount;
