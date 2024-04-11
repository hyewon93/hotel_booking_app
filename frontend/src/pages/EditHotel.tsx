import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";

const EditHotel = () => {
    const { hotelId } = useParams();

    const { showToast } = useAppContext();

    const { data: hotel } = useQuery("fetchMyHotelById", () => apiClient.fetchMyHotelById(hotelId || ''), {
        enabled: !!hotelId,
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"});
        }
    });

    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {
            showToast({message: "Hotel saved successfully!", type: "SUCCESS"});
        },
        onError: () => {
            showToast({message: "Error saving hotel", type: "ERROR"});
        }
    });
    
    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };
    
    return (
        <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
    );
};

export default EditHotel;