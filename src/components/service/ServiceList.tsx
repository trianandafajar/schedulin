"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { createService, updateService, deleteService, toggleServiceStatus, ServiceStatus } from "@/actions/service";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
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

  // Form state
  const [formName, setFormName] = useState("");
  const [formDuration, setFormDuration] = useState(30);
  const [formPrice, setFormPrice] = useState(0);
  const [formIsActive, setFormIsActive] = useState(true);

  const filteredServices = services?.filter((service) => {
    if (filter === "active") return service.is_active;
    if (filter === "inactive") return !service.is_active;
    return true;
  }) || [];

  const openAddModal = () => {
    setEditingService(null);
    setFormName("");
    setFormDuration(30);
    setFormPrice(0);
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormName(service.name);
    setFormDuration(service.duration_minutes);
    setFormPrice(service.price);
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
          duration_minutes: formDuration,
          price: formPrice,
          is_active: formIsActive,
        });
        if (result.error) {
          alert(result.error);
        }
      } else {
        const result = await createService({
          name: formName,
          duration_minutes: formDuration,
          price: formPrice,
        });
        if (result.error) {
          alert(result.error);
        }
      }
      
      // Reload the page to fetch updated data
      window.location.reload();
    } catch (error) {
      console.error("Error saving service:", error);
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
      console.error("Error toggling status:", error);
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
      console.error("Error deleting service:", error);
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
    <ComponentCard title="Services Management">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "active"
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "inactive"
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            Inactive
          </button>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="py-3 font-semibold text-left text-gray-600 dark:text-gray-300">
                Service Name
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-left text-gray-600 dark:text-gray-300">
                Duration
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-left text-gray-600 dark:text-gray-300">
                Price
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-left text-gray-600 dark:text-gray-300">
                Status
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-left text-gray-600 dark:text-gray-300">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow
                key={service.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <TableCell className="py-4 text-gray-900 dark:text-white font-medium">
                  {service.name}
                </TableCell>
                <TableCell className="py-4 text-gray-600 dark:text-gray-400">
                  {formatDuration(service.duration_minutes)}
                </TableCell>
                <TableCell className="py-4 text-gray-600 dark:text-gray-400">
                  {formatPrice(service.price)}
                </TableCell>
                <TableCell className="py-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                    service.is_active 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }`}>
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      title="Edit Service"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(service.id, service.is_active)}
                      disabled={loading}
                      className={`p-2 rounded-lg transition-colors ${
                        service.is_active
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                      }`}
                      title={service.is_active ? "Deactivate" : "Activate"}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        service.is_active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      disabled={deletingId === service.id}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                      title="Delete Service"
                    >
                      {deletingId === service.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
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
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No services found. Add your first service!
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6"
      >
        <div className="flex flex-col">
          <h5 className="mb-4 font-semibold text-gray-800 dark:text-white text-xl">
            {editingService ? "Edit Service" : "Add New Service"}
          </h5>
          
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Service Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                placeholder="e.g., Haircut, Massage, Manicure"
              />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formDuration}
                onChange={(e) => setFormDuration(parseInt(e.target.value) || 0)}
                required
                min="1"
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                placeholder="30"
              />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Price (IDR)
              </label>
              <input
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(parseInt(e.target.value) || 0)}
                required
                min="0"
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                placeholder="50000"
              />
            </div>

            {editingService && (
              <div className="mt-4 flex items-center">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={() => setFormIsActive(!formIsActive)}
                    className="mr-3 h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
                  />
                  Active
                </label>
              </div>
            )}

            <div className="flex items-center gap-3 mt-6 sm:justify-end">
              <Button type="button" onClick={closeModal} variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formName || !formDuration || formPrice < 0 || loading}
                className="btn btn-success"
              >
                {loading ? "Saving..." : editingService ? "Update Service" : "Add Service"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </ComponentCard>
  );
};

export default ServiceList;
