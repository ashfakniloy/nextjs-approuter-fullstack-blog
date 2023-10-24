"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/Form/InputField";
import { Loader } from "@/components/Loaders/Loader";
import { PasswordField } from "@/components/Form/PasswordField";
import { SigninFormProps, signinSchema } from "@/schemas/signinSchema";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
// import { XMarkIcon } from "@heroicons/react/24/solid";

function UserSigninPage() {
  // function UserSigninPage({ isModal }: { isModal?: boolean }) {//for showing modal with parallel route this needs to be a component and should be imported in this page
  const router = useRouter();

  const searchParams = useSearchParams();
  const callback_url = searchParams?.get("callback_url");

  const { data: session } = useSession();

  const defaultValues = {
    email: "",
    password: "",
  };

  const form = useForm<SigninFormProps>({
    defaultValues,
    resolver: zodResolver(signinSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: SigninFormProps) => {
    // console.log("login", values);
    // return;

    // const toastSignin = toast.loading("Loading...");

    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      role: "USER",
      // callbackUrl: `${window.location.origin}`,
      redirect: false,
    });

    console.log("response", response);

    if (!response?.error) {
      console.log("succcess", response);

      // const username = session?.user.username;

      // username &&
      //   toast.success(
      //     `Welcome ${username}`
      //     // {
      //     //   id: toastSignin,
      //     // }
      //   );

      // isModal ? router.back() : router.push("/");

      router.refresh();
      router.push(callback_url || "/");

      // router.push("/");
    } else {
      console.log("error", response);
      toast.error(
        `${response?.error}`
        // {
        //   id: toastSignin,
        // }
      );
    }
  };

  useEffect(() => {
    const username = session?.user.username;
    const role = session?.user.role;

    if (username && role === "USER") {
      toast.success(() => (
        <span className="capitalize">{`Welcome ${username}`}</span>
      ));
    }
  }, [session]);

  return (
    <div className="bg-gray-50 relative mx-3 dark:bg-custom-gray4 rounded-md shadow-md px-7 py-9 lg:px-10 lg:py-12 w-full max-w-[420px]">
      {/* {isModal && (
        <button
          type="button"
          className="absolute right-5 top-5 p-1 rounded-full hover:bg-gray-700"
          onClick={() => router.back()}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      )} */}
      <p className="text-2xl font-montserrat font-bold text-center">Sign In</p>

      <div className="mt-5">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-[42px]"
            noValidate
          >
            <InputField label="Email" name="email" type="email" />
            <PasswordField label="Password" name="password" />

            <div className="pt-1">
              <Button
                type="submit"
                aria-label="submit"
                className="relative w-full h-[42px] text-base"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <span className="absolute flex left-[80px] lg:left-[95px] items-center inset-y-0">
                    <Loader width="30" />
                  </span>
                )}
                <span>Submit</span>
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 dark:text-blue-400">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default UserSigninPage;
