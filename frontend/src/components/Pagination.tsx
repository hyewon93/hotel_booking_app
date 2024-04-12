export type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({currentPage, totalPages, onPageChange}: Props) => {

    const pageNumbers = [];
    for(let i=1; i<=totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center">
            <ul className="flex border border-slate-300">
                {pageNumbers.map((number) => (
                    <li className={`px-2 py-1 ${currentPage == number ? "bg-gray-200" : ""}`} key={number}>
                        <button onClick={() => onPageChange(number)}>{number}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Pagination;