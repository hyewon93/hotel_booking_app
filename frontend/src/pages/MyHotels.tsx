import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { LiaMoneyBillSolid } from "react-icons/lia";
import { MdPeopleOutline } from "react-icons/md";
import { GoStar } from "react-icons/go";

const MyHotels = () => {

    const { showToast } = useAppContext();
    
    const { data: hotelData } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
        onError: () => {

        }
    });

    if(!hotelData) {
        return <span>No Hotels Found</span>
    }

    return (
        <div className="space-y-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">My Hotels</h1>
                <Link to="/add-hotel" className="flex bg-sky-600 text-white text-xl font-bold p-2 hover:bg-sky-500 rounded">Add Hotel</Link>
            </span>
            <div className="grid grid-cols-1 gap-8">
                {hotelData.map((hotel) => (
                    <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
                        <h2 className="text-2xl font-bold">{hotel.name}</h2>
                        <div className="grid grid-cols-5 gap-2">
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center text-sm">
                                <IoLocationOutline className="mr-1" />
                                {hotel.city}, {hotel.country}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center text-sm">
                                <HiOutlineBuildingOffice className="mr-1" />
                                {hotel.type}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center text-sm">
                                <LiaMoneyBillSolid className="mr-1" />
                                ${hotel.pricePerNight} per night
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center text-sm">
                                <MdPeopleOutline className="mr-1" />
                                {hotel.adultCount} adults, {hotel.childCount} children
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center text-sm">
                                <GoStar className="mr-1" />
                                {hotel.starRating} Star Rating
                            </div>
                        </div>
                        <span className="flex justify-end">
                            <Link to={`/edit-hotel/${hotel._id}`} className="flex bg-sky-600 text-white text-md font-bold p-2 hover:bg-sky-500 rounded">View Details</Link>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyHotels;