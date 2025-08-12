"use client";

import CreateLinkForm from "@/features/links/components/CreateLinkForm";
import { linkService, ApiError } from "@/features/links/services/linkService";
import { useState } from "react";
import { toast } from "sonner";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleCreateLink = async (data: {
    originalUrl: string;
    customAlias?: string | null;
  }) => {
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await linkService.createLink(data);

      if (res.status === "success") {
        toast.success("Link created successfully!", {
          description: `Your short link: ${res.data.shortUrl}`,
        });

        // Ambil data yang sudah ada di localStorage
        const existingLinks = JSON.parse(
          localStorage.getItem("shortLinks") || "[]"
        );

        // Tambahkan data baru
        existingLinks.push(res.data);

        // Simpan kembali ke localStorage
        localStorage.setItem("shortLinks", JSON.stringify(existingLinks));
      }
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.data?.errors) {
          const newFieldErrors: { [key: string]: string } = {};
          error.data.errors.forEach(
            (err: { path: string; message: string }) => {
              newFieldErrors[err.path] = err.message;
            }
          );
          setFieldErrors(newFieldErrors);

          const messages = error.data.errors
            .map((e: { message: string }) => e.message)
            .join(", ");
          toast.error(messages);
        } else {
          toast.error(error.message);
        }
        throw error; // <-- Penting agar form tangkap error ini
      } else if (error instanceof Error) {
        toast.error(error.message);
        throw error; // <-- Penting agar form tangkap error ini
      } else {
        toast.error("Failed to create link");
        throw error; // <-- Penting agar form tangkap error ini
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200">
      <section className="flex">
        <div className="flex flex-col w-[50vw] gap-[1.85vw]">
          <p className="text-[3.5vw] leading-tight font-semibold">
            In the grid of data,
            <br /> your link is <br />a{" "}
            <span className="text-[#159976]">weapon</span>
          </p>
          <p className="text-[1.9vw]">
            Jack into real-time analytics, <br />
            forge custom-alias links, <br />
            take the control
          </p>
        </div>

        <div className="pt-[0.2vw] w-[50vw] text-[1.3vw]">
          <CreateLinkForm
            onSubmit={handleCreateLink}
            isLoading={loading}
            fieldErrors={fieldErrors}
          />
        </div>
      </section>
    </main>
  );
}
