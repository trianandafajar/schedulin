import supabase from "@/actions/supabase";
import axios from "@/app/utils/axios";

export const getBusinessCategories = async () => {
  const { data, error } = await supabase
      .from('business_categories_master')
      .select('id, name')
      .order('name');
  
   if (error) {
    console.error("Categories error:", error);
    return [];
  }

  return data ?? [];
};

export const togglePublicBooking = async (businessId: string, isEnabled: boolean) => {
  const response = await axios('/api/business/public', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ businessId, isEnabled }),
  });

  const result = response.data;
  
  if (response.status != 200) {
    throw new Error(result.error || 'Something went wrong');
  }
  
  return result;
};

export const getMyBusiness = async () => {
  const response = await axios('/api/business/me', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.status != 200) {
    throw new Error('Failed to axios business data');
  }

  return response.data;
};