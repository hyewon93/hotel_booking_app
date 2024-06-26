import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const navigate = useNavigate();
    const search = useSearchContext();

    const [destination, setDestination] = useState<string>(search.destination);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
    const [adultCount, setAdultcount] = useState<number>(search.adultCount);
    const [childCount, setChildcount] = useState<number>(search.childCount);

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        search.saveSearchValues(destination, checkIn, checkOut, adultCount, childCount);

        navigate("/search");
    };

    return (
        <form onSubmit={handleSubmit} className="-mt-8 p-3 bg-orange-400 rounded shadow-md flex flex-cols items-center gap-2">
            <div className="flex flex-row items-center flex-1 bg-white p-2 rounded min-w-[220px]">
                <MdTravelExplore size={25} className="mr-2" />
                <input 
                    className="text-md w-full focus:outline-none"
                    placeholder="Where are you going?" 
                    value={destination} 
                    onChange={(event) => setDestination(event.target.value)}
                />
            </div>

            <div>
                <ReactDatePicker 
                    className="bg-white p-2 focus:outline-none rounded"
                    selected={checkIn} 
                    onChange={(date) => setCheckIn(date as Date)} 
                    selectsStart 
                    startDate={checkIn} 
                    endDate={checkOut} 
                    minDate={minDate} 
                    maxDate={maxDate} 
                    placeholderText="Check-in Date"
                />
            </div>
            <div>
                <ReactDatePicker 
                    className="bg-white p-2 focus:outline-none rounded"
                    selected={checkOut} 
                    onChange={(date) => setCheckOut(date as Date)} 
                    selectsStart 
                    startDate={checkIn} 
                    endDate={checkOut} 
                    minDate={minDate} 
                    maxDate={maxDate} 
                    placeholderText="Check-out Date"
                />
            </div>

            <div className="flex bg-white px-2 py-1 gap-2 rounded min-w-[210px]">
                <label className="flex items-center">
                    Adults:
                    <input 
                        className="w-full p-1 font-bold focus:outline-none" 
                        type="number" 
                        min={1} 
                        max={20} 
                        value={adultCount}
                        onChange={(event) => setAdultcount(parseInt(event.target.value))}
                    />
                </label>
                <label className="flex items-center">
                    Children:
                    <input 
                        className="w-full p-1 font-bold focus:outline-none" 
                        type="number" 
                        min={0} 
                        max={20} 
                        value={childCount}
                        onChange={(event) => setChildcount(parseInt(event.target.value))}
                    />
                </label>
            </div>

            <div className="flex gap-1">
                <button type="submit" className="w-full bg-sky-600 text-white h-full p-2 fonnt-bold text-xl rounded hover:bg-sky-500">
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;