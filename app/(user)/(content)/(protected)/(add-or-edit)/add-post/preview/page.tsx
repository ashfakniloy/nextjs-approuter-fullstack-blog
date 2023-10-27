"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import parser from "html-react-parser";
import { toast } from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ClientFormattedDate } from "@/components/ClientFormattedDate";
import { Loader } from "@/components/Loaders/Loader";
import { postSchema } from "@/schemas/postSchema";
import { Button } from "@/components/ui/button";
import { revalidateAllRoutes } from "@/actions/revalidateAllRoutes";

function PostPreviewPage() {
  const router = useRouter();

  const { data: session } = useSession();

  const currentDate = new Date();

  const [previewPost, setPreviewPost] = useState({
    title: "",
    categoryName: "",
    imageUrl: "",
    imageId: "",
    article: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hasPost, setHasPost] = useState(false);

  useEffect(() => {
    // const persistedPost = JSON.parse(localStorage.getItem("newPost") || "");

    const draftPost = localStorage.getItem("draftPost");
    const JsonParsed = draftPost && JSON.parse(draftPost);
    const parsedPost = postSchema.safeParse(JsonParsed);
    if (parsedPost.success !== true) redirect("/add-post");
    setPreviewPost(JsonParsed);
    setHasPost(true);

    // const parsed = formSchema.parse(previewPost);
    // console.log("parsed", parsed);

    // if (parsed.success === false) {
    //   redirect("/add-post");
    // }
  }, []);

  // useEffect(() => {
  //   const persistedPost = localStorage.getItem("draftPost");
  //   const parsedPost = persistedPost && JSON.parse(persistedPost || "");
  //   // console.log(parsedPost);

  //   const regex = /(<([^>]+)>)/gi;
  //   const hasArticle = !!parsedPost.article.replace(regex, "").length;

  //   const parsed = formSchema.safeParse(previewPost);
  //   console.log("parsed", parsed);

  //   // if (
  //   //   !parsedPost ||
  //   //   Object.values(parsedPost).includes("") ||
  //   //   !hasArticle ||
  //   //   parsed.success !== true
  //   // ) {
  //   //   // router.replace("/add-post");

  //   // }
  // }, [previewPost]);

  // useEffect(() => {
  //   const parsed = postSchema.safeParse(previewPost);

  //   if (hasPost && parsed.success !== true) redirect("/add-post");
  // }, [hasPost]);

  // console.log("article", removeHtmlTags(previewPost.article));

  const handlePublish = async () => {
    // console.log("previewPost", previewPost);
    setIsSubmitting(true);
    const toastPublish = toast.loading("Loading...");

    const url = "/api/post";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(previewPost),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Post created successfully", {
        id: toastPublish,
      });
      console.log("success", data);
      const slug = data.response.slug;
      // router.refresh();
      revalidateAllRoutes();
      router.replace(`/post/${slug}`);

      // setDraftPost("");
      localStorage.removeItem("draftPost");
    } else {
      toast.error(`${data.error}`, {
        id: toastPublish,
      });
      console.log("error", data);
    }

    setIsSubmitting(false);
  };

  if (!hasPost) {
    return (
      <div className="min-h-[calc(100dvh-75px)] lg:min-h-[calc(100vh-75px)] flex justify-center items-center">
        <div className="opacity-60">
        <Loader width="50" />
      </div>
      </div>
    );
  }

  return (
    <div className="max-w-full lg:max-w-[796px]">
      <h3 className="mb-3 text-[22px] lg:text-2xl text-center lg:text-start font-extrabold text-gray-700 font-montserrat dark:text-gray-400">
        Post Preview
      </h3>

      <div className="mb-4 text-gray-700 dark:text-gray-300 capitalize">
        {previewPost.categoryName}
      </div>

      <div>
        <div className="flex flex-col min-h-[100px] lg:min-h-[135px]">
          <h1
            className={`text-2xl lg:text-4xl font-bold text-gray-900 dark:text-gray-50 font-montserrat `}
          >
            {previewPost.title}
          </h1>

          <div className="ml-2 lg:ml-0 text-xs lg:text-sm text-gray-700 dark:text-gray-300">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 lg:gap-10 mt-3 lg:mt-5">
              <div className="flex items-center gap-3  lg:gap-6 ">
                <div className="flex items-center gap-2">
                  <div className="relative w-[35px] h-[35px] rounded-full overflow-hidden">
                    {session?.user.imageUrl ? (
                      <Image
                        src={session.user.imageUrl}
                        alt="user image"
                        fill
                        sizes="35px"
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src="/images/blankUser.jpg"
                        alt="user image"
                        width={35}
                        height={35}
                        className="rounded-full"
                      />
                    )}
                  </div>

                  <p className="capitalize">By {session?.user.username}</p>
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 lg:gap-0">
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-0">
                <p>
                  <span>Published: </span>
                  <ClientFormattedDate date={currentDate} />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 h-[280px] lg:h-[470px] relative">
          <Image
            src={previewPost.imageUrl}
            placeholder="blur"
            blurDataURL="/images/placeholder.webp"
            alt="post image"
            fill
            sizes="(max-width: 768px) 500px, 800px"
            className="object-cover"
          />
        </div>

        <div className="mt-6 ProseMirror !border-none !p-0 !max-h-full">
          {parser(previewPost.article || "")}
        </div>
      </div>

      <div className="flex justify-end items-center gap-6 mt-5 mb-5">
        <Link href="/add-post">
          {/* <button
            className="min-w-[120px] py-[9px] hover:text-white dark:hover:text-gray-900 border border-gray-800 dark:border-gray-200 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 rounded-md text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            Edit
          </button> */}
          <Button
            type="button"
            aria-label="edit post"
            variant="outline"
            className="relative min-w-[120px] border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
            disabled={isSubmitting}
          >
            Edit
          </Button>
        </Link>

        <Button
          type="button"
          className="min-w-[120px]"
          aria-label="publish post"
          onClick={handlePublish}
          disabled={isSubmitting}
        >
          Publish
        </Button>
      </div>
    </div>
  );
}

export default PostPreviewPage;
