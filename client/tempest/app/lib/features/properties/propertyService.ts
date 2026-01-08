import api from "../axiosInstance";
import {
  Property,
  Reservation,
  Paginated,
  PropertyFilterParams,
  PaginationParams,
  PropertyTag,
  Review,
  ReservationFilterParams,
} from "../../definitions";

const PROPERTY_BASE_URL = `${process.env.NEXT_PUBLIC_API_HOST}/properties`;
const RESERVATION_BASE_URL = `${process.env.NEXT_PUBLIC_API_HOST}/properties/reservation`;

const getPropertyList = async (
  filters: PropertyFilterParams,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Property>>(PROPERTY_BASE_URL, {
    params: { ...filters, ...pagination },
  });
  return response.data;
};
// usage: getPropertyList({ location: "Manila" }, { page: 1, page_size: 10 });

const getPropertyList1 = async (
  filters: PropertyFilterParams,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Property>>(PROPERTY_BASE_URL, {
    params: { ...filters, ...pagination },
  });
  return response.data;
};

const getPropertyList2 = async (
  filters: PropertyFilterParams,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Property>>(PROPERTY_BASE_URL, {
    params: { ...filters, ...pagination },
  });
  return response.data;
};

const getPropertyList3 = async (
  filters: PropertyFilterParams,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Property>>(PROPERTY_BASE_URL, {
    params: { ...filters, ...pagination },
  });
  return response.data;
};

const getUserPropertyList = async (
  filters: PropertyFilterParams,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Property>>(PROPERTY_BASE_URL, {
    params: { ...filters, ...pagination },
  });
  return response.data;
};

const getReservationList = async (
  filters: ReservationFilterParams,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Reservation>>(RESERVATION_BASE_URL, {
    params: { ...filters, ...pagination },
  });
  return response.data;
};

const getReservationPropertyList = async (propertyId: string) => {
  const response = await api.get<Reservation[]>(
    `${RESERVATION_BASE_URL}/p/${propertyId}`
  );
  return response.data;
};

const getHostReservationList = async (
  filters: ReservationFilterParams,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Reservation>>(
    `${RESERVATION_BASE_URL}/host`,
    {
      params: { ...filters, ...pagination },
    }
  );
  return response.data;
};

const getHostReservationPropertyList = async (
  propertyId: string,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Reservation>>(
    `${PROPERTY_BASE_URL}/${propertyId}/reservation`,
    {
      params: { propertyId, ...pagination },
    }
  );
  return response.data;
};

const getReservationRequestsList = async ({ page = 1, pageSize = 10 } = {}) => {
  const response = await api.get<Paginated<Reservation>>(
    `${RESERVATION_BASE_URL}/requests`,
    {
      params: { page, page_size: pageSize },
    }
  );
  return response.data;
};

const approveReservation = async (reservationId: string) => {
  const response = await api.post(
    `${RESERVATION_BASE_URL}/${reservationId}/approve/`
  );
  return response.data;
};

const declineReservation = async (reservationId: string) => {
  const response = await api.post(
    `${RESERVATION_BASE_URL}/${reservationId}/decline/`
  );
  return response.data;
};

const createProperty = async (formData: FormData) => {
  const response = await api.post(`${PROPERTY_BASE_URL}/create/`, formData);
  return response.data;
};

const getPropertyDetail = async (propertyId: string) => {
  const response = await api.get<Property>(
    `${PROPERTY_BASE_URL}/${propertyId}`
  );
  return response.data;
};

const getReservationDetail = async (reservationId: string) => {
  const response = await api.get<Reservation>(
    `${RESERVATION_BASE_URL}/${reservationId}`
  );
  return response.data;
};

const updateProperty = async (propertyId: string, formData: FormData) => {
  const response = await api.patch<Property>(
    `${PROPERTY_BASE_URL}/${propertyId}/update/`,
    formData
  );
  return response.data;
};

const deleteProperty = async (propertyId: string) => {
  const response = await api.delete<Property>(
    `${PROPERTY_BASE_URL}/${propertyId}/delete/`
  );
  return response.data;
};

const createReservation = async (formData: Reservation) => {
  const response = await api.post(`${RESERVATION_BASE_URL}/`, formData);
  return response.data;
};

const getPropertyTags = async () => {
  const response = await api.get<PropertyTag[]>(`${PROPERTY_BASE_URL}/tags`);
  return response.data;
};

const getUserLikesList = async () => {
  const response = await api.get<Property[]>(`${PROPERTY_BASE_URL}/likes`);
  return response.data;
};

const getPropertyReviews = async (
  propertyId: string,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Review>>(
    `${process.env.NEXT_PUBLIC_API_HOST}/reviews/${propertyId}`,
    {
      params: { propertyId, ...pagination },
    }
  );
  return response.data;
};

const createPropertyReview = async (propertyId: string, formData: FormData) => {
  const response = await api.post<void>(
    `${process.env.NEXT_PUBLIC_API_HOST}/reviews/${propertyId}/`,
    formData
  );
  return response.data;
};

const toggleFavorite = async (propertyId: string) => {
  const response = await api.post(
    `${PROPERTY_BASE_URL}/${propertyId}/toggle-favorite/`
  );
  return response.data;
};

const propertyService = {
  getReservationList,
  getPropertyList1,
  getPropertyList2,
  getPropertyList3,
  getReservationPropertyList,
  getHostReservationList,
  getHostReservationPropertyList,
  getUserPropertyList,
  getPropertyList,
  createProperty,
  getPropertyDetail,
  getReservationDetail,
  updateProperty,
  deleteProperty,
  createReservation,
  getReservationRequestsList,
  approveReservation,
  declineReservation,
  getPropertyTags,
  getUserLikesList,
  getPropertyReviews,
  createPropertyReview,
  toggleFavorite,
};
export default propertyService;
