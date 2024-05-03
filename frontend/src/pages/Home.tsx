import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import SearchResultCard from "../components/SearchResultCard";

const Home = () => {
    const { data: hotels } = useQuery("fetchPopularHotels", apiClient.fetchPopularHotels);

    if(!hotels || hotels.length === 0) {
        return <span>None</span>;
    }

    return (
        <div className="space-y-5">
            <h3 className="text-3xl font-bold">Top 3 Popular Hotels</h3>
            {hotels.map((hotel) => (
                <div key={hotel._id}>
                    <SearchResultCard hotel={hotel} />
                </div>
            ))}
        </div>
    )
};

export default Home;