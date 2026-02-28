"use server";

import supabase from "./supabase";
import { auth } from "@clerk/nextjs/server";

export type ServiceStatus = "active" | "inactive";

export interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  business_id: string;
}

export async function getServices(): Promise<{ data: Service[] | null; error: string | null }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { data: null, error: "Unauthorized" };
    }

    const { data: business, error: businessError } = await supabase
      .from("business")
      .select("id")
      .eq("owner_id", userId)
      .single();

    if (businessError || !business) {
      return { data: null, error: businessError?.message || "Business not found" };
    }

    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: services as Service[], error: null };
  } catch (error) {
    return { data: null, error: "An unexpected error occurred" };
  }
}

export async function createService(serviceData: {
  name: string;
  duration_minutes: number;
  price: number;
}): Promise<{ data: Service | null; error: string | null }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { data: null, error: "Unauthorized" };
    }

    const { data: business, error: businessError } = await supabase
      .from("business")
      .select("id")
      .eq("owner_id", userId)
      .single();

    if (businessError || !business) {
      return { data: null, error: businessError?.message || "Business not found" };
    }

    const { data: service, error } = await supabase
      .from("services")
      .insert({
        business_id: business.id,
        name: serviceData.name,
        duration_minutes: serviceData.duration_minutes,
        price: serviceData.price,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: service as Service, error: null };
  } catch (error) {
    return { data: null, error: "An unexpected error occurred" };
  }
}

export async function updateService(
  id: string,
  serviceData: {
    name: string;
    duration_minutes: number;
    price: number;
    is_active: boolean;
  }
): Promise<{ data: Service | null; error: string | null }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { data: null, error: "Unauthorized" };
    }

    const { data: service, error } = await supabase
      .from("services")
      .update({
        name: serviceData.name,
        duration_minutes: serviceData.duration_minutes,
        price: serviceData.price,
        is_active: serviceData.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: service as Service, error: null };
  } catch (error) {
    return { data: null, error: "An unexpected error occurred" };
  }
}

export async function deleteService(
  id: string
): Promise<{ data: null; error: string | null }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { data: null, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: "An unexpected error occurred" };
  }
}

export async function toggleServiceStatus(
  id: string,
  isActive: boolean
): Promise<{ data: Service | null; error: string | null }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { data: null, error: "Unauthorized" };
    }

    const { data: service, error } = await supabase
      .from("services")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: service as Service, error: null };
  } catch (error) {
    return { data: null, error: "An unexpected error occurred" };
  }
}
