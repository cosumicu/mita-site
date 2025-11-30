import api from "../axiosInstance";
import {
  Property,
  Reservation,
  Paginated,
  PropertyFilterParams,
  PaginationParams,
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

const getUserPropertyList = async (
  userId: string,
  pagination: PaginationParams
) => {
  const response = await api.get<Paginated<Property>>(PROPERTY_BASE_URL, {
    params: { user: userId, ...pagination },
  });
  return response.data;
};

const getReservationList = async (pagination: PaginationParams) => {
  const response = await api.get<Paginated<Reservation>>(RESERVATION_BASE_URL, {
    params: pagination,
  });
  return response.data;
};

const getReservationPropertyList = async (propertyId: string) => {
  const response = await api.get<Reservation[]>(
    `${RESERVATION_BASE_URL}p/${propertyId}`
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
    `${RESERVATION_BASE_URL}/requests/${reservationId}/approve/`
  );
  return response.data;
};

const declineReservation = async (reservationId: string) => {
  const response = await api.post(
    `${RESERVATION_BASE_URL}/requests/${reservationId}/decline/`
  );
  return response.data;
};

const createProperty = async (formData: Property) => {
  const response = await api.post(`${PROPERTY_BASE_URL}/create/`, formData);
  return response.data;
};

const getPropertyDetail = async (propertyId: string) => {
  const response = await api.get<Property>(
    `${PROPERTY_BASE_URL}/${propertyId}`
  );
  return response.data;
};

const updateProperty = async (propertyId: string) => {
  const response = await api.get<Property>(
    `${PROPERTY_BASE_URL}/${propertyId}/update/`
  );
  return response.data;
};

const deleteProperty = async (propertyId: string) => {
  const response = await api.get<Property>(
    `${PROPERTY_BASE_URL}/${propertyId}/delete/`
  );
  return response.data;
};

const createReservation = async (formData: Reservation) => {
  const response = await api.post(`${RESERVATION_BASE_URL}/`, formData);
  return response.data;
};

const getUserLikesList = async () => {
  const response = await api.get<Property[]>(`${PROPERTY_BASE_URL}/likes`);
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
  getReservationPropertyList,
  getUserPropertyList,
  getPropertyList,
  createProperty,
  getPropertyDetail,
  updateProperty,
  deleteProperty,
  createReservation,
  getReservationRequestsList,
  approveReservation,
  declineReservation,
  getUserLikesList,
  toggleFavorite,
};
export default propertyService;
