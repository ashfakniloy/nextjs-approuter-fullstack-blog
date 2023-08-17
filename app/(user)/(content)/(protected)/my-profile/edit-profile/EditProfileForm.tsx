"use client";

import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/Form/InputField";
import { IconFacebook } from "@/components/Icons/IconFacebook";
import { IconTwitter } from "@/components/Icons/IconTwitter";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Profile } from "@prisma/client";
import { TextAreaField } from "@/components/Form/TextAreaField";
import { FileField } from "@/components/Form/FIleField";
import { IconLinkedin } from "@/components/Icons/IconLinkedin";
import { IconReddit } from "@/components/Icons/IconReddit";

function EditProfileForm({
  profile,
}: {
  profile:
    | (Profile & {
        user: {
          username: string;
        };
      })
    | null;
}) {
  const router = useRouter();

  const defaultValues = {
    imageUrl: profile?.imageUrl ?? "",
    imageId: profile?.imageId ?? "",
    bio: profile?.bio ?? "",
    facebook: profile?.facebook ?? "",
    twitter: profile?.twitter ?? "",
    linkedin: profile?.linkedin ?? "",
    reddit: profile?.reddit ?? "",
  };

  const formSchema = z.object({
    imageUrl: z.string().optional(),
    imageId: z.string().optional(),
    bio: z.string().optional(),
    facebook: z.string().url("Enter valid URL").optional().or(z.literal("")),
    twitter: z.string().url("Enter valid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Enter valid URL").optional().or(z.literal("")),
    reddit: z.string().url("Enter valid URL").optional().or(z.literal("")),
  });

  type FormValuesProps = z.infer<typeof formSchema>;

  const form = useForm<FormValuesProps>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValuesProps) => {
    const toastProfileUpdate = toast.loading("Loading...");

    const url = `/api/profile?profileId=${profile?.id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    // console.log("submit", values);

    // return;

    if (response.ok) {
      console.log("success", data);
      toast.success("Profile updated successfully", {
        id: toastProfileUpdate,
      });

      router.refresh();
    } else {
      console.log("error", data);
      toast.error("Something went wrong", {
        id: toastProfileUpdate,
      });
    }
  };

  return (
    <div className="">
      <h4 className="mb-5 text-[22px] lg:text-2xl text-center lg:text-start font-extrabold text-gray-700 font-montserrat dark:text-gray-400">
        Edit Your Profile
      </h4>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 lg:w-[450px]"
          noValidate
        >
          <FileField label="Image" name="imageUrl" />
          <TextAreaField label="Bio" name="bio" />

          <div className="">
            <label className="inline-block mb-2">Social Accounts</label>
            <span className="w-5 h-5"></span>
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <IconFacebook className="w-[25px] h-[25px] fill-gray-800 dark:fill-gray-100" />
                <div className="w-[450px]">
                  <InputField
                    type="text"
                    name="facebook"
                    placeholder="Enter facebook profile"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconTwitter className="w-[25px] h-[25px] fill-gray-800 dark:fill-gray-100" />
                <div className="w-[450px]">
                  <InputField
                    type="text"
                    name="twitter"
                    placeholder="Enter twitter profile"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconLinkedin className="w-[25px] h-[25px] fill-gray-800 dark:fill-gray-100" />
                <div className="w-[450px]">
                  <InputField
                    type="text"
                    name="linkedin"
                    placeholder="Enter linkedin profile"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconReddit className="w-[25px] h-[25px] fill-gray-800 dark:fill-gray-100" />
                <div className="w-[450px]">
                  <InputField
                    type="text"
                    name="reddit"
                    placeholder="Enter reddit profile"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-md dark:text-black dark:bg-white"
            >
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default EditProfileForm;
