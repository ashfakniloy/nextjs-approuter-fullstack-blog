"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { DynamicField } from "@/components/Form/DynamicField";
import { ImageField } from "@/components/Form/ImageField";
import { InputField } from "@/components/Form/InputField";
import { Button } from "@/components/ui/button";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CategoryOptionProps } from "./CategoryOption";
import { CategoryFormProps, categorySchema } from "@/schemas/categorySchema";

type EditCategoryProps = CategoryOptionProps & {
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditCategory({
  id,
  name,
  imageUrl,
  imageId,
  quotes,
  setShowEditModal,
}: EditCategoryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const defaultValues = {
    name: name,
    imageUrl: imageUrl,
    imageId: imageId,
    quotes: quotes?.length ? quotes : [{ quote: "", author: "" }],
  };

  const form = useForm<CategoryFormProps>({
    // defaultValues,
    values: defaultValues,
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (values: CategoryFormProps) => {
    // console.log(values);
    // return;

    setIsSubmitting(true);
    const toastCategoryAdd = toast.loading("Loading...");

    const url = `/api/admin/category?categoryId=${id}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (response.ok) {
      form.reset();
      router.refresh();
      // await fetch(
      //   `/api/revalidate?path=${`/admin/categories/${data.response.name
      //     .split(" ")
      //     .join("_")
      //     .toLowerCase()}`}`
      // );
      toast.success("Category updated successfully", {
        id: toastCategoryAdd,
      });
      console.log("success", data);

      router.replace(`/admin/categories/${data.response.name.toLowerCase()}`);
      setShowEditModal(false);
    } else {
      toast.error(`${data.error}`, {
        id: toastCategoryAdd,
      });
      console.log("error", data);
    }

    setIsSubmitting(false);

    // router.push("/add-post/preview");
  };

  return (
    <div className="">
      <button
        type="button"
        title="Close"
        className="absolute top-2 right-2 rounded-full overflow-hidden flex justify-end hover:scale-110 transition-transform duration-100 disabled:cursor-not-allowed"
        onClick={() => setShowEditModal(false)}
        disabled={isSubmitting}
      >
        <XCircleIcon className="w-7 h-7" />
      </button>

      <h1 className="text-2xl font-bold text-center">Edit category</h1>
      <ScrollArea className="">
        <div className="max-h-[650px] px-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mt-10"
              noValidate
            >
              <InputField type="text" label="Category Name" name="name" />

              <ImageField label="Image" name="imageUrl" isAdmin />

              {/* <DynamicField
               label="Quote"
              type="text"
              name="contactNo"
              optionName="number"
              maxLength={4} /> */}

              <DynamicField
                name="quotes"
                optionNames={["quote", "author"]}
                labels={["Quote", "Author"]}
                type="text"
                maxLength={20}
              />

              <div className="flex justify-between pt-4 gap-8">
                <Button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  // className="w-full bg-emerald-700 hover:bg-emerald-600 text-white"
                  variant="outline"
                  className="w-full border-gray-700 dark:border-gray-400"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </ScrollArea>
    </div>
  );
}

export default EditCategory;
