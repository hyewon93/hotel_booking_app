import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    imageUrls: string[];
    adultCount: number;
    childCount: number;
}

type Props = {
    hotel?: HotelType;
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
};

const ManageHotelForm = ({ hotel, onSave, isLoading }: Props) => {

    const formMethods = useForm<HotelFormData>();
    const { handleSubmit, reset } = formMethods;

    useEffect(() => {
        reset(hotel);
    }, [hotel, reset]);

    const onSubmit = handleSubmit((formDataJSON: HotelFormData) => {
        const formData = new FormData();

        if(hotel) {
            formData.append("hotelId", hotel._id);
        }

        formData.append("name", formDataJSON.name);
        formData.append("city", formDataJSON.city);
        formData.append("country", formDataJSON.country);
        formData.append("description", formDataJSON.description);
        formData.append("type", formDataJSON.type);
        formData.append("pricePerNight", formDataJSON.pricePerNight.toString());
        formData.append("starRating", formDataJSON.starRating.toString());
        formData.append("adultCount", formDataJSON.adultCount.toString());
        formData.append("childCount", formDataJSON.childCount.toString());

        formDataJSON.facilities.forEach((facility, idx) => {
            formData.append(`facilities[${idx}]`, facility);
        });

        // exsiting updated images
        if(formDataJSON.imageUrls) {
            formDataJSON.imageUrls.forEach((imageUrl, idx) => {
                formData.append(`imageUrls[${idx}]`, imageUrl);
            });
        }

        // new added images
        Array.from(formDataJSON.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile); 
        });

        onSave(formData);
    });

    return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection />
                <TypeSection />
                <FacilitiesSection />
                <GuestsSection />
                <ImagesSection />
                <span className="flex justify-end">
                    <button type="submit" disabled={isLoading} className="bg-sky-600 text-white p-2 font-bold hover:bg-sky-500 text-xl rounded disabled:bg-gray-500">
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </span>
            </form> 
        </FormProvider>
    );
};

export default ManageHotelForm;