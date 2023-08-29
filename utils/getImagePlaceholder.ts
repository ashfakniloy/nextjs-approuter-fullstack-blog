// import { getPlaiceholder } from "plaiceholder";
// import fs from "node:fs/promises";

// export const getImagePlaceholder = async (ogImageUrl: string) => {
//   const imageUrl = ogImageUrl.replace("/upload/", "/upload/w_5/");

//   try {
//     const res = await fetch(imageUrl);

//     // if (!res.ok) {
//     //   throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
//     //   // console.log(`Failed to fetch image: ${res.status} ${res.statusText}`);
//     //   // return;
//     // }

//     const buffer = await res.arrayBuffer();

//     const { base64 } = await getPlaiceholder(Buffer.from(buffer));

//     return base64;
//   } catch (e) {
//     // if (e instanceof Error) console.log(e.stack);

//     const file = await fs.readFile(`public/images/placeholder.webp`);
//     const { base64: staticBlurImage } = await getPlaiceholder(file);

//     return staticBlurImage;
//   }
// };

// export const getMultipleImagePlaceholder = async (imageUrls: string[]) => {
//   // const imageUrls = ogImageUrls.map((imageUrl) =>
//   //   imageUrl.replace("/upload/", "/upload/w_5/")
//   // );

//   // making all request at once instead of awating each one - avoiding waterfall
//   const base64Promises = imageUrls.map((imageUrl) =>
//     getImagePlaceholder(imageUrl)
//   );

//   const base64Results = await Promise.all(base64Promises);

//   const photosWithBlur = imageUrls.map((imageUrl, i) => {
//     imageUrl = base64Results[i];
//     return imageUrl;
//   });

//   return photosWithBlur;
// };

import { getPlaiceholder } from "plaiceholder";
import fs from "node:fs/promises";

// const getStaticBlur = async () => {
//   const file = await fs.readFile(`public/images/placeholder.webp`);
//   const { base64: staticBlurImage } = await getPlaiceholder(file);

//   return staticBlurImage;
// };

export const getImagePlaceholder = async (ogImageUrl: string) => {
  // try {
  //   const imageUrl = ogImageUrl?.replace("/upload/", "/upload/w_5/");
  //   const res = await fetch(imageUrl);

  //   if (res.ok) {
  //     const buffer = await res.arrayBuffer();

  //     const { base64 } = await getPlaiceholder(Buffer.from(buffer));

  //     return base64;
  //   } else {
  //     // throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
  //     console.log(`Failed to fetch image: ${res.status} ${res.statusText}`);
  //     const staticBlurImage = await getStaticBlur();
  //     return staticBlurImage;
  //   }
  // } catch (error) {
  //   if (error instanceof Error) console.log(error.stack);

  //   const staticBlurImage = await getStaticBlur();
  //   return staticBlurImage;
  // }

  const imageUrl = ogImageUrl?.replace("/upload/", "/upload/w_5/");
  const res = await fetch(imageUrl, { cache: "no-store" });

  console.log("res", res.ok);

  if (res.ok) {
    const buffer = await res.arrayBuffer();

    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return base64;
  } else {
    // throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
    console.log(`Failed to fetch image: ${res.status} ${res.statusText}`);
    // const staticBlurImage = await getStaticBlur();
    // return staticBlurImage;

    const file = await fs.readFile(`public/images/placeholder.webp`);
    const { base64: staticBlurImage } = await getPlaiceholder(file);

    return staticBlurImage;
  }
};

export const getMultipleImagePlaceholder = async (imageUrls: string[]) => {
  // making all request at once instead of awating each one - avoiding waterfall
  const base64Promises = imageUrls.map((imageUrl) =>
    getImagePlaceholder(imageUrl)
  );

  const base64Results = await Promise.all(base64Promises);

  const photosWithBlur = imageUrls.map((imageUrl, i) => {
    imageUrl = base64Results[i];
    return imageUrl;
  });

  return photosWithBlur;
};
