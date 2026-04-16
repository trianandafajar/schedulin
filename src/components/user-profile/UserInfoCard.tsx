"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useUser } from "@clerk/nextjs";
import { getBusinessesByOwner } from "@/service/businessService";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useUser();

  const [business, setBusiness] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const buttonDisable =
    user?.primaryEmailAddress?.emailAddress === "accountdemo@gmail.com";

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.id) return;

      try {
        const data = await getBusinessesByOwner(user.id);
        setBusiness(data);
      } catch (error) {
        console.error("Error loading business info:", error);
      }
    };

    loadBookings();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      console.log("Profile updated!");
      closeModal();
    } catch (error) {
      console.error("Update gagal:", error);
    }
  };

  console.log(business);

  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase();

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111111]">
      <div className="flex flex-col border-b border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-[#151515]/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-xl font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
            {initials || "?"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Personal Information
            </p>
          </div>
        </div>
        <button
          onClick={openModal}
          className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-200 dark:hover:bg-[#222] dark:hover:text-brand-400 dark:focus:ring-offset-[#111111] sm:mt-0"
        >
          <svg
            className="h-4 w-4 fill-current"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
            />
          </svg>
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3 lg:divide-x">
        <div className="p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-[#151515]/50">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            First Name
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {user?.firstName || "-"}
          </p>
        </div>

        <div className="p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-[#151515]/50">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Last Name
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {user?.lastName || "-"}
          </p>
        </div>

        <div className="p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-[#151515]/50 sm:col-span-2 lg:col-span-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Email Address
          </p>
          <p className="truncate text-base font-medium text-gray-900 dark:text-white">
            {user?.primaryEmailAddress?.emailAddress || "-"}
          </p>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 w-full max-w-lg p-0">
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#111111]">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5 dark:border-gray-800 dark:bg-[#151515]/50">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Edit Personal Information
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update your details to keep your profile up-to-date.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="space-y-5 px-6 py-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>First Name</Label>
                  <div className="rounded-xl border border-gray-200 bg-white transition-all focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 dark:border-gray-700 dark:bg-[#1a1a1a] dark:focus-within:border-brand-500">
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Last Name</Label>
                  <div className="rounded-xl border border-gray-200 bg-white transition-all focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 dark:border-gray-700 dark:bg-[#1a1a1a] dark:focus-within:border-brand-500">
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Email Address</Label>
                <div className="rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#151515]">
                  <Input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Email addresses cannot be changed directly from this panel.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-[#151515]/50">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={buttonDisable}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}