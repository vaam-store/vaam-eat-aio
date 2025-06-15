"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { SettingCard } from "@app/components/settings/setting-card";
import { api } from "@app/trpc/react";
import { useRouter } from "next/navigation";
import { Upload } from "react-feather";
import { useUploadFile } from "@app/hooks/upload-file";
import { showErrorToast } from "@app/utils/error-handler";

const validationSchema = z.object({
  name: z.string(),
  image: z.string().url().optional(),
});

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const updateUser = api.zen.user.update.useMutation();
  const {
    mutate: uploadFile,
    upload: { isPending: isUploading },
  } = useUploadFile();
  const [avatarPreview, setAvatarPreview] = useState(
    session?.user?.image ?? "/placeholder-avatar.jpg",
  );

  const initialValues: Record<"name" | "image", string> = {
    name: session?.user?.name ?? "",
    image: session?.user?.image ?? "",
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      try {
        return await uploadFile(file);
      } catch (error) {
        showErrorToast(error, "Error uploading file:");
        // Handle error, maybe set a default image or show an error message
        return null;
      }
    }
  };

  return (
    <SettingCard title="Edit Profile">
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (!session?.user?.id) {
              showErrorToast("User ID not found. Please try again.");
              setSubmitting(false);
              return;
            }
            await updateUser.mutateAsync({
              where: {
                id: session.user.id,
              },
              data: {
                name: values.name,
                image: values.image,
              },
            });
            await update({ name: values.name, image: values.image }); // Update session
            router.push("/settings/account");
          } catch (error) {
            showErrorToast(error, "Failed to update profile:");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values: _values,
          dirty: _dirty,
          isValid: _isValid,
        }) => (
          <Form className="form-control flex flex-col gap-4 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="relative w-24 overflow-hidden rounded-full">
                  <Image
                    src={avatarPreview}
                    alt="User Avatar"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <label htmlFor="avatar-upload" className="btn btn-outline">
                <Upload size={16} /> Upload Avatar
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    void (async () => {
                      const uploadedUrl = await handleFileChange(e);
                      if (uploadedUrl?.publicUrl) {
                        setFieldValue("image", uploadedUrl?.publicUrl);
                      }
                    })();
                  }}
                  disabled={isUploading}
                />
              </label>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Your full name"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-error text-sm"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </SettingCard>
  );
}
