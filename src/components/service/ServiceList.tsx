"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { createService, updateService, deleteService, toggleServiceStatus } from "@/actions/service";
import { Modal } from "@/components/ui/modal";
import { Check, X, Loader2, Pencil, Trash2, Plus } from "lucide-react";

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  business_id: string;
}

interface ServiceListProps {
  services?: Service[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const filteredServices = services?.filter((service) => {
    if (filter === "active") return service.is_active;
    if (filter === "inactive") return !service.is_active;
    return true;
  }) || [];

  const openAddModal = () => {
    setEditingService(null);
    setFormName("");
    setFormDuration("");
    setFormPrice("");
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormName(service.name);
    setFormDuration(service.duration_minutes.toString());
    setFormPrice(service.price.toString());
    setFormIsActive(service.is_active);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingService) {
        const result = await updateService(editingService.id, {
          name: formName,
          duration_minutes: Number(formDuration),
          price: Number(formPrice),
          is_active: formIsActive,
        });
        if (result.error) {
          alert(result.error);
        }
      } else {
        const result = await createService({
          name: formName,
          duration_minutes: Number(formDuration),
          price: Number(formPrice),
        });
        if (result.error) {
          alert(result.error);
        }
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (serviceId: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const result = await toggleServiceStatus(serviceId, !currentStatus);
      if (result.error) {
        alert(result.error);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setDeletingId(serviceId);
    try {
      const result = await deleteService(serviceId);
      if (result.error) {
        alert(result.error);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete service");
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <ComponentCard title="Services Inventory">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit items-center rounded-xl bg-gray-100/80 p-1.5 dark:bg-[#151515]">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative rounded-lg px-5 py-2 text-sm font-semibold capitalize tracking-wide transition-all duration-300 ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm dark:bg-[#222] dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-brand-500/20 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-[#111111]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111111]">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-[#151515]/50">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Service Details
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Duration
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {filteredServices.map((service) => (
                <TableRow
                  key={service.id}
                  className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-[#151515]/50"
                >
                  <TableCell className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {service.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className=" rounded-md bg-blue-800 px-2.5 py-1 text-xs font-medium text-white dark:bg-gray-800 dark:text-white">
                      {formatDuration(service.duration_minutes)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {formatPrice(service.price)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      service.is_active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${service.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {service.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(service)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                        title="Edit Service"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(service.id, service.is_active)}
                        disabled={loading}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
                          service.is_active
                            ? "text-gray-500 hover:bg-amber-50 hover:text-amber-600 dark:text-gray-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                            : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 dark:text-gray-400 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                        }`}
                        title={service.is_active ? "Deactivate" : "Activate"}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                          service.is_active ? <X className="h-4 w-4 stroke-[2.5]" /> : <Check className="h-4 w-4 stroke-[2.5]" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deletingId === service.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        title="Delete Service"
                      >
                        {deletingId === service.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredServices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-[#151515]">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">No services found</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new service offering.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-2xl dark:border-gray-800 dark:bg-[#111111]"
      >
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-[#151515]/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingService ? "Edit Service" : "Create Service"}
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Service Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm text-gray-900 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-[#151515] dark:text-white dark:focus:border-brand-500"
                placeholder="e.g., Signature Haircut"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration <span className="text-gray-400">(mins)</span>
                </label>
                <input
                  type="text"
                  value={formDuration}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) setFormDuration(value);
                  }}
                  required
                  inputMode="numeric"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm text-gray-900 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-[#151515] dark:text-white dark:focus:border-brand-500"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price <span className="text-gray-400">(IDR)</span>
                </label>
                <input
                  type="text"
                  value={formPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) setFormPrice(value);
                  }}
                  required
                  inputMode="numeric"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm text-gray-900 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-[#151515] dark:text-white dark:focus:border-brand-500"
                  placeholder="150000"
                />
              </div>
            </div>

            {editingService && (
              <div className="pt-2">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111111] dark:hover:bg-[#151515]">
                  <div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Active Status</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Available for booking</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={() => setFormIsActive(!formIsActive)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500 peer-focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-offset-[#111111]"></div>
                  </div>
                </label>
              </div>
            )}

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
              <button
                type="button"
                onClick={closeModal}
                className="h-10 rounded-xl px-5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#222]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formName || !formDuration || !formPrice || loading}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-500 px-6 text-sm font-medium text-white transition-all hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-[#111111]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : editingService ? (
                  "Save Changes"
                ) : (
                  "Create Service"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </ComponentCard>
  );
};

export default ServiceList;